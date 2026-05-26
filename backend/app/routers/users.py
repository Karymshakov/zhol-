from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Profile
from ..auth import hash_password, verify_password, create_access_token, require_user, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str


class LoginPayload(BaseModel):
    email: str
    password: str


class LinkSessionPayload(BaseModel):
    session_id: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    user: UserResponse


class HistoryItem(BaseModel):
    session_id: str
    riasec_code: str
    matched_careers: list[str]
    created_at: str


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email уже используется")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Пароль должен быть не менее 6 символов")
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(require_user)):
    return UserResponse(id=user.id, name=user.name, email=user.email)


@router.post("/link-session")
def link_session(
    payload: LinkSessionPayload,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.session_id == payload.session_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Сессия не найдена")
    profile.user_id = user.id
    db.commit()
    return {"ok": True}


@router.get("/history", response_model=list[HistoryItem])
def history(user: User = Depends(require_user), db: Session = Depends(get_db)):
    profiles = (
        db.query(Profile)
        .filter(Profile.user_id == user.id)
        .order_by(Profile.created_at.desc())
        .all()
    )
    return [
        HistoryItem(
            session_id=p.session_id,
            riasec_code=p.riasec_code,
            matched_careers=p.matched_careers or [],
            created_at=p.created_at.isoformat(),
        )
        for p in profiles
    ]
