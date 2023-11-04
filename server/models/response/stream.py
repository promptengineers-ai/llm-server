"""Response model for a chat stream message."""

RESPONSE_STREAM_CHAT = """data: {"sender":"assistant","message":"The","type":"stream"}

data: {"sender":"assistant","message":" Arizona","type":"stream"}

data: {"sender":"assistant","message":" Diamond","type":"stream"}

data: {"sender":"assistant","message":"backs","type":"stream"}

data: {"sender":"assistant","message":" had","type":"stream"}

data: {"sender":"assistant","message":" a","type":"stream"}

data: {"sender":"assistant","message":" few","type":"stream"}

data: {"sender":"assistant","message":" standout","type":"stream"}

data: {"sender":"assistant","message":" pitchers","type":"stream"}

data: {"sender":"assistant","message":" during","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" ","type":"stream"}

data: {"sender":"assistant","message":"200","type":"stream"}

data: {"sender":"assistant","message":"1","type":"stream"}

data: {"sender":"assistant","message":" World","type":"stream"}

data: {"sender":"assistant","message":" Series","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":" Randy","type":"stream"}

data: {"sender":"assistant","message":" Johnson","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" Curt","type":"stream"}

data: {"sender":"assistant","message":" Sch","type":"stream"}

data: {"sender":"assistant","message":"illing","type":"stream"}

data: {"sender":"assistant","message":" were","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" primary","type":"stream"}

data: {"sender":"assistant","message":" pitchers","type":"stream"}

data: {"sender":"assistant","message":" for","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" team","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":"","type":"end"}"""

#############################################################################
## Langchain Chat Stream Response
#############################################################################
RESPONSE_STREAM_AGENT_CHAT = """data: {"sender":"assistant","message":"$","type":"stream"}

data: {"sender":"assistant","message":"200","type":"stream"}

data: {"sender":"assistant","message":"0","type":"stream"}

data: {"sender":"assistant","message":" compounded","type":"stream"}

data: {"sender":"assistant","message":" at","type":"stream"}

data: {"sender":"assistant","message":" ","type":"stream"}

data: {"sender":"assistant","message":"5","type":"stream"}

data: {"sender":"assistant","message":" percent","type":"stream"}

data: {"sender":"assistant","message":" for","type":"stream"}

data: {"sender":"assistant","message":" ","type":"stream"}

data: {"sender":"assistant","message":"10","type":"stream"}

data: {"sender":"assistant","message":" years","type":"stream"}

data: {"sender":"assistant","message":" will","type":"stream"}

data: {"sender":"assistant","message":" be","type":"stream"}

data: {"sender":"assistant","message":" approximately","type":"stream"}

data: {"sender":"assistant","message":" $","type":"stream"}

data: {"sender":"assistant","message":"325","type":"stream"}

data: {"sender":"assistant","message":"7","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":"79","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":"","type":"end"}"""

#############################################################################
## Agent Plugins
#############################################################################
RESPONSE_STREAM_AGENT_PLUGINS_CHAT = """data: {"sender":"assistant","message":"When","type":"stream"}

data: {"sender":"assistant","message":" entering","type":"stream"}

data: {"sender":"assistant","message":" a","type":"stream"}

data: {"sender":"assistant","message":" shop","type":"stream"}

data: {"sender":"assistant","message":" in","type":"stream"}

data: {"sender":"assistant","message":" French","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" it","type":"stream"}

data: {"sender":"assistant","message":" is","type":"stream"}

data: {"sender":"assistant","message":" polite","type":"stream"}

data: {"sender":"assistant","message":" to","type":"stream"}

data: {"sender":"assistant","message":" greet","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" shop","type":"stream"}

data: {"sender":"assistant","message":" employees","type":"stream"}

data: {"sender":"assistant","message":" with","type":"stream"}

data: {"sender":"assistant","message":" a","type":"stream"}

data: {"sender":"assistant","message":" simple","type":"stream"}

data: {"sender":"assistant","message":" \"","type":"stream"}

data: {"sender":"assistant","message":"Bonjour","type":"stream"}

data: {"sender":"assistant","message":"\"","type":"stream"}

data: {"sender":"assistant","message":" (","type":"stream"}

data: {"sender":"assistant","message":"which","type":"stream"}

data: {"sender":"assistant","message":" means","type":"stream"}

data: {"sender":"assistant","message":" \"","type":"stream"}

data: {"sender":"assistant","message":"Hello","type":"stream"}

data: {"sender":"assistant","message":"\"","type":"stream"}

data: {"sender":"assistant","message":" or","type":"stream"}

data: {"sender":"assistant","message":" \"","type":"stream"}

data: {"sender":"assistant","message":"Good","type":"stream"}

data: {"sender":"assistant","message":" day","type":"stream"}

data: {"sender":"assistant","message":"\").","type":"stream"}

data: {"sender":"assistant","message":" Additionally","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" you","type":"stream"}

data: {"sender":"assistant","message":" can","type":"stream"}

data: {"sender":"assistant","message":" use","type":"stream"}

data: {"sender":"assistant","message":" \"","type":"stream"}

data: {"sender":"assistant","message":"Bon","type":"stream"}

data: {"sender":"assistant","message":"so","type":"stream"}

data: {"sender":"assistant","message":"ir","type":"stream"}

data: {"sender":"assistant","message":"\"","type":"stream"}

data: {"sender":"assistant","message":" (","type":"stream"}

data: {"sender":"assistant","message":"which","type":"stream"}

data: {"sender":"assistant","message":" means","type":"stream"}

data: {"sender":"assistant","message":" \"","type":"stream"}

data: {"sender":"assistant","message":"Good","type":"stream"}

data: {"sender":"assistant","message":" evening","type":"stream"}

data: {"sender":"assistant","message":"\")","type":"stream"}

data: {"sender":"assistant","message":" if","type":"stream"}

data: {"sender":"assistant","message":" you","type":"stream"}

data: {"sender":"assistant","message":" enter","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" shop","type":"stream"}

data: {"sender":"assistant","message":" in","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" evening","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":" These","type":"stream"}

data: {"sender":"assistant","message":" greetings","type":"stream"}

data: {"sender":"assistant","message":" are","type":"stream"}

data: {"sender":"assistant","message":" considered","type":"stream"}

data: {"sender":"assistant","message":" polite","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" respectful","type":"stream"}

data: {"sender":"assistant","message":" in","type":"stream"}

data: {"sender":"assistant","message":" French","type":"stream"}

data: {"sender":"assistant","message":" culture","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":"","type":"end"}"""

#############################################################################
## Langchain Vectorstore Chat Stream
#############################################################################
RESPONSE_STREAM_VECTORSTORE_CHAT = """data: {"sender":"assistant","message":"The","type":"stream"}

data: {"sender":"assistant","message":" context","type":"stream"}

data: {"sender":"assistant","message":" is","type":"stream"}

data: {"sender":"assistant","message":" about","type":"stream"}

data: {"sender":"assistant","message":" projects","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" their","type":"stream"}

data: {"sender":"assistant","message":" components","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" such","type":"stream"}

data: {"sender":"assistant","message":" as","type":"stream"}

data: {"sender":"assistant","message":" forms","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" resources","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" submissions","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" actions","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" logs","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" access","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" revisions","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" settings","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" roles","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" stages","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" integr","type":"stream"}

data: {"sender":"assistant","message":"ations","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" authentication","type":"stream"}

data: {"sender":"assistant","message":",","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" stage","type":"stream"}

data: {"sender":"assistant","message":" versions","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" deployments","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":" It","type":"stream"}

data: {"sender":"assistant","message":" also","type":"stream"}

data: {"sender":"assistant","message":" mentions","type":"stream"}

data: {"sender":"assistant","message":" the","type":"stream"}

data: {"sender":"assistant","message":" ability","type":"stream"}

data: {"sender":"assistant","message":" to","type":"stream"}

data: {"sender":"assistant","message":" introduce","type":"stream"}

data: {"sender":"assistant","message":" custom","type":"stream"}

data: {"sender":"assistant","message":" evaluation","type":"stream"}

data: {"sender":"assistant","message":" context","type":"stream"}

data: {"sender":"assistant","message":" variables","type":"stream"}

data: {"sender":"assistant","message":" for","type":"stream"}

data: {"sender":"assistant","message":" validations","type":"stream"}

data: {"sender":"assistant","message":" and","type":"stream"}

data: {"sender":"assistant","message":" other","type":"stream"}

data: {"sender":"assistant","message":" purposes","type":"stream"}

data: {"sender":"assistant","message":".","type":"stream"}

data: {"sender":"assistant","message":"","type":"end"}"""