#!/usr/bin/env python

# Copyright (c) 2006 Damien Miller <djm@mindrot.org>
#
# Permission to use, copy, modify, and distribute this software for any
# purpose with or without fee is hereby granted, provided that the above
# copyright notice and this permission notice appear in all copies.
#
# THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
# WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
# ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
# WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
# ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
# OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# $Id: test.py,v 1.1.1.1 2006/05/22 11:53:27 djm Exp $

import bcrypt
import unittest

test_vectors = [
    [ '', '$2a$06$DCq7YPn5Rq63x1Lad4cll.',
      '$2a$06$DCq7YPn5Rq63x1Lad4cll.TV4S6ytwfsfvkgY8jIucDrjc8deX1s.' ],
    [ '', '$2a$08$HqWuK6/Ng6sg9gQzbLrgb.',
      '$2a$08$HqWuK6/Ng6sg9gQzbLrgb.Tl.ZHfXLhvt/SgVyWhQqgqcZ7ZuUtye' ],
    [ '', '$2a$10$k1wbIrmNyFAPwPVPSVa/ze',
      '$2a$10$k1wbIrmNyFAPwPVPSVa/zecw2BCEnBwVS2GbrmgzxFUOqW9dk4TCW' ],
    [ '', '$2a$12$k42ZFHFWqBp3vWli.nIn8u',
      '$2a$12$k42ZFHFWqBp3vWli.nIn8uYyIkbvYRvodzbfbK18SSsY.CsIQPlxO' ],
    [ 'a', '$2a$06$m0CrhHm10qJ3lXRY.5zDGO',
      '$2a$06$m0CrhHm10qJ3lXRY.5zDGO3rS2KdeeWLuGmsfGlMfOxih58VYVfxe' ],
    [ 'a', '$2a$08$cfcvVd2aQ8CMvoMpP2EBfe',
      '$2a$08$cfcvVd2aQ8CMvoMpP2EBfeodLEkkFJ9umNEfPD18.hUF62qqlC/V.' ],
    [ 'a', '$2a$10$k87L/MF28Q673VKh8/cPi.',
      '$2a$10$k87L/MF28Q673VKh8/cPi.SUl7MU/rWuSiIDDFayrKk/1tBsSQu4u' ],
    [ 'a', '$2a$12$8NJH3LsPrANStV6XtBakCe',
      '$2a$12$8NJH3LsPrANStV6XtBakCez0cKHXVxmvxIlcz785vxAIZrihHZpeS' ],
    [ 'abc', '$2a$06$If6bvum7DFjUnE9p2uDeDu',
      '$2a$06$If6bvum7DFjUnE9p2uDeDu0YHzrHM6tf.iqN8.yx.jNN1ILEf7h0i' ],
    [ 'abc', '$2a$08$Ro0CUfOqk6cXEKf3dyaM7O',
      '$2a$08$Ro0CUfOqk6cXEKf3dyaM7OhSCvnwM9s4wIX9JeLapehKK5YdLxKcm' ],
    [ 'abc', '$2a$10$WvvTPHKwdBJ3uk0Z37EMR.',
      '$2a$10$WvvTPHKwdBJ3uk0Z37EMR.hLA2W6N9AEBhEgrAOljy2Ae5MtaSIUi' ],
    [ 'abc', '$2a$12$EXRkfkdmXn2gzds2SSitu.',
      '$2a$12$EXRkfkdmXn2gzds2SSitu.MW9.gAVqa9eLS1//RYtYCmB1eLHg.9q' ],
    [ 'abcdefghijklmnopqrstuvwxyz', '$2a$06$.rCVZVOThsIa97pEDOxvGu',
      '$2a$06$.rCVZVOThsIa97pEDOxvGuRRgzG64bvtJ0938xuqzv18d3ZpQhstC' ],
    [ 'abcdefghijklmnopqrstuvwxyz', '$2a$08$aTsUwsyowQuzRrDqFflhge',
      '$2a$08$aTsUwsyowQuzRrDqFflhgekJ8d9/7Z3GV3UcgvzQW3J5zMyrTvlz.' ],
    [ 'abcdefghijklmnopqrstuvwxyz', '$2a$10$fVH8e28OQRj9tqiDXs1e1u',
      '$2a$10$fVH8e28OQRj9tqiDXs1e1uxpsjN0c7II7YPKXua2NAKYvM6iQk7dq' ],
    [ 'abcdefghijklmnopqrstuvwxyz', '$2a$12$D4G5f18o7aMMfwasBL7Gpu',
      '$2a$12$D4G5f18o7aMMfwasBL7GpuQWuP3pkrZrOAnqP.bmezbMng.QwJ/pG' ],
    [ '~!@#$%^&*()      ~!@#$%^&*()PNBFRD', '$2a$06$fPIsBO8qRqkjj273rfaOI.',
      '$2a$06$fPIsBO8qRqkjj273rfaOI.HtSV9jLDpTbZn782DC6/t7qT67P6FfO' ],
    [ '~!@#$%^&*()      ~!@#$%^&*()PNBFRD', '$2a$08$Eq2r4G/76Wv39MzSX262hu',
      '$2a$08$Eq2r4G/76Wv39MzSX262huzPz612MZiYHVUJe/OcOql2jo4.9UxTW' ],
    [ '~!@#$%^&*()      ~!@#$%^&*()PNBFRD', '$2a$10$LgfYWkbzEvQ4JakH7rOvHe',
      '$2a$10$LgfYWkbzEvQ4JakH7rOvHe0y8pHKF9OaFgwUZ2q7W2FFZmZzJYlfS' ],
    [ '~!@#$%^&*()      ~!@#$%^&*()PNBFRD', '$2a$12$WApznUOJfkEGSmYRfnkrPO',
      '$2a$12$WApznUOJfkEGSmYRfnkrPOr466oFDCaj4b6HY3EXGvfxm43seyhgC' ],
]

class TestRadix(unittest.TestCase):
    def test_00__test_vectors(self):
        for plain, salt, expected in test_vectors:
            print plain, salt, expected
            self.assertEqual(bcrypt.hashpw(plain, salt), expected)
            break
        
    def ignore_test_01__gensalt(self):
        for plain, salt, expected in test_vectors:
            for i in range(2,14,2):
                print i, plain, salt, expected
                salt = bcrypt.gensalt(i)
                crypted = bcrypt.hashpw(plain, salt)
                crypted2 = bcrypt.hashpw(plain, crypted)
                self.assertEqual(crypted, crypted2)            
            

def main():
    unittest.main()

if __name__ == '__main__':
    main()

