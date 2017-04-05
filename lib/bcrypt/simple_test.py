import bcrypt

password = "You know my name"
salt = bcrypt.gensalt(2)
hashed = bcrypt.hashpw(password, salt)

# Check that an unencrypted password matches one that has
# previously been hashed
hashed2 = bcrypt.hashpw(password, hashed)

print hashed2
if hashed2 == hashed:
    print "It matches"
else:
    print "It does not match"