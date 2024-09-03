from pydantic import BaseModel, ConfigDict


class MatchRate(BaseModel):
    score: float
    rawScore: float


class JobScanResponse(BaseModel):
    model_config = ConfigDict(strict=True)

    findings: list
    matchRate: MatchRate
    skills: dict
    keywords: list
    highValueSkills: list
    metadata: dict


class ScanFailedException(Exception):
    pass
