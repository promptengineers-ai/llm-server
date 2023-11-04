"""Functions configuration file."""

from server.utils.functions import get_word_length

AVAILABLE_FUNCTIONS = {
	"get_word_length": get_word_length
}

FUNCTIONS = [
	{
		"name": "get_word_length",
		"description": "Returns the length of a word.",
		"parameters": {
			"type": "object",
			"properties": {
				"word": {
					"type": "string",
					"description": "The word whose length needs to be determined."
				}
			},
			"required": ["word"]
		}
	}
]
