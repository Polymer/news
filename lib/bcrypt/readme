The is a native Python implementation of the py-bcrypt package from http://www.mindrot.org/projects/py-bcrypt/ made by Damien Miller.
--- begin excerpt from the original package

py-bcrypt is a Python wrapper of OpenBSD's Blowfish password hashing code, as described in "A Future-Adaptable Password Scheme" by Niels Provos and David Mazières.

This system hashes passwords using a version of Bruce Schneier's Blowfish block cipher with modifications designed to raise the cost of off-line password cracking and frustrate fast hardware implementation. The computation cost of the algorithm is parametised, so it can be increased as computers get faster. The intent is to make a compromise of a password database less likely to result in an attacker gaining knowledge of the plaintext passwords (e.g. using John the Ripper).

py-bcrypt requires Python 2.4. Older versions may work, but the bcrypt.gensalt() method won't - it requires the cryptographic random number generator os.urandom() introduced in 2.4.

py-bcrypt is licensed under a ISC/BSD licence. The underlying Blowfish and hashing code implementation is taken from OpenBSD's libc and is subject to a 4-term BSD license. See the LICENSE file for details.

The API is very simple:

import bcrypt

# Hash a password for the first time, with a randomly-generated salt
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

# gensalt's log_rounds parameter determines the complexity.
# The work factor is 2**log_rounds, and the default is 12
hashed = bcrypt.hashpw(password, bcrypt.gensalt(10))

# Check that an unencrypted password matches one that has
# previously been hashed
if bcrypt.hashpw(password, hashed) == hashed:
        print "It matches"
else:
        print "It does not match"

--- end excerpt from the original package

This excerpt pretty much sums up this package also with two main differences:
1. This package is 100% native python.
2. Is is two orders of magnitude slower!, so gensalt() by default only generate the salt using 1 round instead of 1024 rounds as in the original package.
The hash is still quite strong but not as strong as . 

Use this package when you need to generate a password hash and you can only use native python <cough>Google App Engine</cough>

I did some obvious optimization to speed things up and I will be more then happy if someone will make it go faster

The package comes with the original unittest of the native package and passes all the tests.