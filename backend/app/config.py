from typing import List, Optional
from pydantic import BaseModel, Field


class ALConfig(BaseModel):
    class_names: Optional[List[str]] = Field(None, alias="classNames")
