from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import create_client, Client
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Portail RH")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_TTL_HOURS = int(os.getenv("JWT_TTL_HOURS", 12))
security = HTTPBearer()

class LoginRequest(BaseModel):
    email: str
    password: str

def create_token(user_id: str, email: str, role: str, prenom: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_TTL_HOURS)
    return jwt.encode(
        {"sub": user_id, "email": email, "role": role, "prenom": prenom, "exp": expire},
        JWT_SECRET, algorithm="HS256"
    )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

@app.post("/api/auth/login")
def login(req: LoginRequest):
    result = supabase.table("users").select("*").eq("email", req.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    user = result.data[0]
    if not pwd_context.verify(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    token = create_token(user["id"], user["email"], user["role"], user["prenom"])
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "role": user["role"], "prenom": user["prenom"]}
    }

@app.post("/api/auth/logout")
def logout():
    return {"message": "Déconnecté"}

@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/api/sites")
def get_sites(current_user: dict = Depends(get_current_user)):
    result = supabase.table("sites").select("*").execute()
    return result.data

@app.get("/api/employees")
def get_employees(current_user: dict = Depends(get_current_user)):
    role = current_user["role"]
    if role in ["super_admin", "drh", "comptable"]:
        result = supabase.table("employees").select("*, sites(nom, marque)").execute()
    elif role == "directrice":
        user = supabase.table("users").select("site_id").eq("id", current_user["sub"]).execute()
        site_id = user.data[0]["site_id"]
        result = supabase.table("employees").select("*, sites(nom, marque)").eq("site_id", site_id).execute()
    else:
        result = supabase.table("employees").select("*, sites(nom, marque)").eq("email", current_user["email"]).execute()
    return result.data

@app.get("/api/dashboard")
def get_dashboard(current_user: dict = Depends(get_current_user)):
    employees = supabase.table("employees").select("*").execute().data
    sites = supabase.table("sites").select("*").execute().data
    print(f"Employees: {len(employees)}, Sites: {len(sites)}")
    actifs = [e for e in employees if e["statut"] == "actif"]
    periode_essai = [e for e in employees if e["statut"] == "periode_essai"]
    cdi = [e for e in employees if e["contrat"] == "CDI"]
    cdd = [e for e in employees if e["contrat"] == "CDD"]
    capacite_totale = sum(s["capacite"] for s in sites if s.get("capacite"))
    taux = round((len(actifs) / capacite_totale * 100)) if capacite_totale > 0 else 0
    return {
        "effectif": len(actifs),
        "periode_essai": len(periode_essai),
        "cdi": len(cdi),
        "cdd": len(cdd),
        "nb_sites": len(sites),
        "taux_occupation": taux,
        "alertes_ouvertes": 7,
        "alertes_critiques": 1,
        "masse_salariale": 54
    }

@app.get("/")
def root():
    return {"message": "Portail RH API"}