"""OpenBSD Blowfish password hashing.

This module implements the OpenBSD Blowfish password hashing
algorithm, as described in "A Future-Adaptable Password Scheme" by
Niels Provos and David Mazieres.

This system hashes passwords using a version of Bruce Schneier's
Blowfish block cipher with modifications designed to raise the cost
of off-line password cracking. The computation cost of the algorithm
is parametised, so it can be increased as computers get faster.

Passwords are hashed using the hashpw() routine:

  hashpw(password, salt) -> hashed_password

Salts for the the second parameter may be randomly generated using the
gensalt() function:

  gensalt(log_rounds = 12) -> random_salt

The parameter "log_rounds" defines the complexity of the hashing. The
cost increases as 2**log_rounds.
"""
 
# This password hashing algorithm was designed by David Mazieres
# <dm@lcs.mit.edu> and works as follows:
#
# 1. state := InitState ()
# 2. state := ExpandKey (state, salt, password) 3.
# REPEAT rounds:
#    state := ExpandKey (state, 0, salt)
#      state := ExpandKey(state, 0, password)
# 4. ctext := "OrpheanBeholderScryDoubt"
# 5. REPEAT 64:
#     ctext := Encrypt_ECB (state, ctext);
# 6. RETURN Concatenate (salt, ctext);

 

# This implementation is adaptable to current computing power.
# You can have up to 2^31 rounds which should be enough for some
# time to come.

import blowfish
import os

BCRYPT_VERSION = '2'
BCRYPT_MAXSALT = 16    
BCRYPT_BLOCKS = 6        # Ciphertext blocks
BCRYPT_MINROUNDS = 1    # we have log2(rounds) in salt

def _encode_salt(salt, log_rounds):
    """encode_salt(csalt, log_rounds) -> encoded_salt
    Encode a raw binary salt and the specified log2(rounds) as a
    standard bcrypt text salt. Used internally by bcrypt.gensalt()"""

    if len(salt) != 16:
        raise ValueError("Invalid salt length")

    if log_rounds < 1 or log_rounds > 31:
        raise ValueError("Invalid number of rounds")
        
    result = "$%sa$%2.2u$" % (BCRYPT_VERSION, log_rounds)
    result += encode_base64(salt)
    return result


# We handle $Vers$log2(NumRounds)$salt+passwd$
#  i.e. $2$04$iwouldntknowwhattosayetKdJ6iFtacBqJdKe6aW7ou 

def hashpw(key, salt):
    """hashpw(password, salt) -> hashed_password
    Hash the specified password and the salt using the OpenBSD
    Blowfish password hashing algorithm. Returns the hashed password."""

    # Discard "$" identifier 
    index = 0
    index += 1

    if salt[index] > BCRYPT_VERSION:
        raise ValueError('Invalid Version')

    # Check for minor versions 
    if salt[index+1] != '$':
        if salt[index+1]  == 'a':
            # 'ab' should not yield the same as 'abab' 
            minor = salt[index+1]
            index += 1
        else:
            raise ValueError('Invalid Sig')
    else:
        minor = 0

    # Discard version + "$" identifier 
    index += 2

    if salt[index+2] != '$':
        # Out of sync with passwd entry 
        raise ValueError('Invalid Sig')

    # Computer power doesn't increase linear, 2^x should be fine 
    n = int(salt[index:index+2])
    if n > 31 or n < 0:
        raise ValueError('Invalid rounds')
        
    logr = n
    rounds = 1 << logr
    if rounds < BCRYPT_MINROUNDS:
        raise ValueError('Invalid rounds')

    # Discard num rounds + "$" identifier 
    index += 3

    csalt = salt[index:] 
    if len(csalt) * 3 / 4 < BCRYPT_MAXSALT:
        raise ValueError('Invalid salt')

    # We dont want the base64 salt but the raw data 
    csalt = decode_base64(csalt)
    
    if minor >= 'a':
        key += '\0'
        
    key = [ord(ch) for ch in key]
    state = blowfish.initstate()
    # Setting up S-Boxes and Subkeys 
    blowfish.expandstate(state, csalt, key)
    
    for _ in range(rounds):
        blowfish.expand0state(state, key)
        blowfish.expand0state(state, csalt)

    ciphertext = [ord(ch) for ch in "OrpheanBeholderScryDoubt"]
        
    # This can be precomputed later 
    j = 0;
    cdata = [None] * BCRYPT_BLOCKS
    for i in xrange(BCRYPT_BLOCKS):
        cdata[i], j = blowfish.stream2word(ciphertext, j)

    # Now do the encryption 
    for _ in xrange(64):
        blowfish.pybc_blf_enc(state, cdata, BCRYPT_BLOCKS / 2)

    for i in xrange(BCRYPT_BLOCKS):
        ciphertext[4 * i + 3] = cdata[i] & 0xff
        cdata[i] = cdata[i] >> 8
        ciphertext[4 * i + 2] = cdata[i] & 0xff
        cdata[i] = cdata[i] >> 8
        ciphertext[4 * i + 1] = cdata[i] & 0xff
        cdata[i] = cdata[i] >> 8
        ciphertext[4 * i + 0] = cdata[i] & 0xff

    encrypted = ''
    encrypted += '$'
    encrypted += str(BCRYPT_VERSION)
    if minor > 0:
        encrypted += minor
        
    encrypted += '$'

    encrypted += "%2.2u$" % (logr)

    encrypted += encode_base64(csalt)
    encrypted += encode_base64(ciphertext[:4 * BCRYPT_BLOCKS - 1])
    
    return encrypted
    
def gensalt(log_rounds = 1):
    """Generate a random text salt for use with hashpw(). "log_rounds"
    defines the complexity of the hashing, increasing the cost as
    2**log_rounds."""
    return _encode_salt([ord(ch) for ch in os.urandom(16)], min(max(log_rounds, 1), 31))


Base64Code = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

index_64 = [
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 0, 1, 54, 55,
    56, 57, 58, 59, 60, 61, 62, 63, 255, 255,
    255, 255, 255, 255, 255, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    255, 255, 255, 255, 255, 255, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51, 52, 53, 255, 255, 255, 255, 255]

def CHAR64(c): 
    return 255 if ord(c) > 127 else index_64[ord(c)]

def decode_base64(data):
    dest_index = 0
    result = []
    for src_index in range(0, len(data), 4):
        c1 = CHAR64(data[src_index])
        
        if src_index + 1 >= len(data):
            break

        c2 = CHAR64(data[src_index+1])

        # Invalid data */
        if c1 == 255 or c2 == 255:
            break

        result.append((c1 << 2) | ((c2 & 0x30) >> 4))
        dest_index += 1

        if src_index + 2 >= len(data) or dest_index == BCRYPT_MAXSALT:
            break
        
        c3 = CHAR64(data[src_index + 2])
        if c3 == 255:
            break

        result.append(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2))
        dest_index += 1

        if src_index + 3 >= len(data) or dest_index == BCRYPT_MAXSALT:
            break

        c4 = CHAR64(data[src_index + 3])
        if c4 == 255:
            break
        
        result.append(((c3 & 0x03) << 6) | c4)
        dest_index += 1

        if dest_index == BCRYPT_MAXSALT:
            break

    return result

def encode_base64(data):
    src_index = 0
    result = ''
    while src_index < len(data):
        c1 = data[src_index]
        src_index += 1
        result += Base64Code[c1 >> 2]
        c1 = (c1 & 0x03) << 4
        if src_index >= len(data):
            result += Base64Code[c1]
            break
        
        c2 = data[src_index]
        src_index += 1
        c1 |= (c2 >> 4) & 0x0f
        result += Base64Code[c1]
        c1 = (c2 & 0x0f) << 2;
        if src_index >= len(data):
            result += Base64Code[c1]
            break
        
        c2 = data[src_index]
        src_index += 1
        c1 |= (c2 >> 6) & 0x03
        result += Base64Code[c1]
        result += Base64Code[c2 & 0x3f]

    return result
