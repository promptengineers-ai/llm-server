from typing import Any
from src.config.llm import MODEL_LIST

def filter_models(model_names):
	"""
	Filter the MODEL_LIST based on the provided model names.

	:param model_names: A string or a list of strings representing the model names to filter.
	:type model_names: str or List[str]
	:return: A list of model dictionaries that match the names in model_names. If model_names is a string,
			returns a list with a single model dictionary. If model_names is neither a string nor a list,
			raises a ValueError.
	:rtype: List[Dict[str, Any]]
	:raises ValueError: If model_names is neither a string nor a list.
	"""
	# Check if model_names is a single string or a list of strings
	if isinstance(model_names, str):
		# Find the model dictionary by name and return it
		return [next((model for model in MODEL_LIST if model['model_name'] == model_names), None)]
	elif isinstance(model_names, list):
		# Return a list of model dictionaries that match the names in model_names
		return [model for model in MODEL_LIST if model['model_name'] in model_names]
	else:
		# If the input is neither a string nor a list, raise an error
		raise ValueError("Input must be a string or a list of strings.")
	
def available_models(model_type: str = None)-> list[dict[str, Any]]:
    """
    Retrieve a list of available models based on the specified model type.

    Args:
        model_type (str, optional): The type of model to filter by. If not provided, all models are returned.

    Returns:
        list: A list of dictionaries containing the available models. Each dictionary contains the model name and its corresponding parameters, excluding 'litellm_params'.
    """

    # If a model type is specified, filter models based on type and availability of API key or base URL
    if model_type:
        # Retrieve models matching the specified type with credentials, excluding 'litellm_params'
        return [
            {key: value for key, value in model.items() if key != "litellm_params"}
            for model in MODEL_LIST
            if model.get(model_type) and (model['litellm_params'].get('api_key') or model['litellm_params'].get('api_base'))
        ]
    else:
        # Retrieve all models with credentials, excluding 'litellm_params'
        return [
            {key: value for key, value in model.items() if key != "litellm_params"}
            for model in MODEL_LIST
            if model['litellm_params'].get('api_key') or model['litellm_params'].get('api_base')
        ]
        
def model_sets(model_type: str = None):
	"""
	Return a set of model names based on the specified model type.
	"""
	model_dict = available_models(model_type)
	model_names = set(d['model_name'] for d in model_dict)
	return model_names