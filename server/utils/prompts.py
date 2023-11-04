"""Chat GPT Clone Prompt Template"""
from langchain.prompts import PromptTemplate

def get_system_template(system_message: str):
    prompt_template = f"""{system_message}
---
{{history}}
User: {{input}}
Assistant: """
    template = PromptTemplate(
        template=prompt_template,
        input_variables=["history", "input"]
    )
    return template
