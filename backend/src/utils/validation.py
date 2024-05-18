from typing import Union, List, Set

from src.utils.exception import ValidationException, token_not_found_message

class Validator:

	def validate_api_keys(
		self,
		available_tokens: Union[dict, str],
		require_keys: Union[List[str], Set[str]],
		exception_class=ValidationException
	) -> None:
		if isinstance(available_tokens, str):
			available_tokens = {require_keys[0]: available_tokens}  # This assumes require_keys is not empty
		error_message = token_not_found_message(available_tokens, list(require_keys))
		if error_message:
			raise exception_class(error_message)