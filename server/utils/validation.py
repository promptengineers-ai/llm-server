from typing import Union

from server.exceptions import ValidationException
from server.utils.errors import token_not_found_message


class Validator:

	def validate_api_keys(
		self,
		available_tokens: Union[dict, str],
		require_keys: list[str],
		exception_class=ValidationException
	) -> None:
		if isinstance(available_tokens, str):
			available_tokens = {require_keys[0]: available_tokens}
		error_message = token_not_found_message(available_tokens, require_keys)
		if error_message:
			raise exception_class(error_message)