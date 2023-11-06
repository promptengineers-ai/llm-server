"""Chat GPT Clone Prompt Template"""
from langchain.prompts import PromptTemplate

def get_system_template(system_message: str):
    prompt_template = f"""{system_message}
---
{{context}}
User: {{question}}
Assistant: """
    template = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"]
    )
    return template