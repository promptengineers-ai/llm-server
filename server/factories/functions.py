"""Function Service"""""
import json

from server.config.functions import AVAILABLE_FUNCTIONS

class FunctionTypeFactory:
    """Function Type Factory"""
    def get_result(self, fn_type, response_message):
        """Get Result"""
        function_args = json.loads(response_message["function_call"]["arguments"])

        if fn_type == "get_word_length":
            function_to_call = AVAILABLE_FUNCTIONS[fn_type]
            return function_to_call(
			    word=function_args.get("word"),
			)
        raise ValueError("Invalid Function type.")
