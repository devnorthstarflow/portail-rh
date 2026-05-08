from passlib.context import CryptContext
ctx = CryptContext(schemes=['bcrypt'], deprecated='auto')

hash_en_base = '$2b$12$q.fFjgZRpi5bL59221fPJOKCrS40PT5xx824HUBh9UaQECL4GhxUm'

print("Test Admin2026! :", ctx.verify('Admin2026!', hash_en_base))
print("Test secret :", ctx.verify('secret', hash_en_base))
print("Test preparationfocus2026 :", ctx.verify('preparationfocus2026', hash_en_base))