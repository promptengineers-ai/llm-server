from fastapi import APIRouter
from fastapi.responses import UJSONResponse

from src.controllers.loader import LoaderController

__name__ = "loader"
router = APIRouter()
controller = LoaderController()
    
# Adding a route using router.add_api_route
router.add_api_route(
    path=f"/{__name__}s/website",
    endpoint=controller.website_links,
    methods=["GET"],
    response_model=dict,
    status_code=200,
    tags=[__name__.title()],
    summary=f"Links from {__name__.title()}s website",
    description=f"Links from {__name__.title()}s website",
    response_description=f"List of {__name__.title()}s website links",
    name=f"{__name__}s_link_list",
    response_class=UJSONResponse,
    include_in_schema=True,
    operation_id=f"{__name__}s_link_list",
    openapi_extra={
        "responses": {
            "200": {
                "description": "OK",
                "content": {
                    "application/json": {
                        "example": {
                            "links": [
                                "https://adaptive.biz/",
                                "https://adaptive.biz/blogs",
                                "https://adaptive.biz/projects"
                            ]
                        },
                        # "schema": ResponseSettingsList.schema()
                    }
                }
            }
        }
    }
)

router.add_api_route(
    path=f"/documents",
    endpoint=controller.fetch_documents,
    methods=["POST"],
    response_model=dict,
    status_code=200,
    tags=['Document'],
    summary=f"Documents from {__name__.title()}",
    description=f"Documents from {__name__.title()}",
    response_description=f"List of {__name__.title()} documents",
    name=f"{__name__}s_document_list_from_loaders",
    response_class=UJSONResponse,
    include_in_schema=True,
    operation_id=f"{__name__}s_document_list_from_loaders",
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "examples": {
                        "Chat": {
                            "summary": "Default Chat",
                            "value": {
                                "task_id": "1234",
                                "loaders": [
                                    {
                                        "type": "web_base",
                                        "urls": [
                                            "https://www.promptingguide.ai/introduction/tips"
                                        ]
                                    }
                                ],
                                "splitter": {
                                    "type": "recursive",
                                    "chunk_size": 1000,
                                    "chunk_overlap": 100
                                }
                            },
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description": "OK",
                "content": {
                    "application/json": {
                        "example": {
                            "documents": [
                                {
                                    "type": "Document",
                                    "page_content": "This is a page",
                                    "metadata": {"source": "https://www.google.com", "language":"en", "index": 1, "character_count": 1000, "word_count": 200}
                                }
                            ]
                        },
                        # "schema": ResponseSettingsList.schema()
                    }
                }
            }
        }
    }
)

router.add_api_route(
    path=f"/documents/files",
    endpoint=controller.from_files,
    methods=["POST"],
    response_model=dict,
    status_code=200,
    tags=['Document'],
    summary=f"Documents from {__name__.title()}",
    description=f"Documents from {__name__.title()}",
    response_description=f"List of {__name__.title()} documents",
    name=f"{__name__}s_document_list_from_files",
    response_class=UJSONResponse,
    include_in_schema=True,
    operation_id=f"{__name__}s_document_list_from_files",
    openapi_extra={
        "responses": {
            "200": {
                "description": "OK",
                "content": {
                    "application/json": {
                        "example": {
                            "documents": [
                                {
                                    "type": "Document",
                                    "page_content": "This is a page",
                                    "metadata": {"source": "https://www.google.com", "language":"en", "index": 1, "character_count": 1000, "word_count": 200}
                                }
                            ]
                        },
                        # "schema": ResponseSettingsList.schema()
                    }
                }
            }
        }
    }
)

router.add_api_route(
    path=f"/documents/upsert",
    endpoint=controller.upsert_documents,
    methods=["POST"],
    response_model=dict,
    status_code=200,
    tags=['Document'],
    summary=f"Uploda documents from {__name__.title()}",
    description=f"Upload documents from {__name__.title()}",
    response_description=f"List of {__name__.title()} documents",
    name=f"{__name__}s_upload_documents",
    response_class=UJSONResponse,
    include_in_schema=True,
    operation_id=f"{__name__}s_upload_documents",
    openapi_extra={
        "requestBody": {
            "content": {
                "application/json": {
                    "examples": {
                        "Chat": {
                            "summary": "Upsert Documents",
                            "value": {
                                "provider": "pinecone",
                                "index_name": "real_estate",
                                "embedding": "text-embedding-3-small",
                                "documents": [
                                    {
                                        "page_content": "11-15-18 \nTREC NO. 49 -1  \n\n\nThe financing described in the Third Party Financing Addendum attached to the contract for the sale of the \nabove -referenced Property does not involve FHA or VA financing.\n\n(Check one box only)   \n \n  (1) WAIVER.  \n\nBuyer waives Buyer ’s right to terminate the contract under Paragraph 2B of the \nThird Party Financing Addendum if Property Approval is not obtained because the opinion of value in \nthe  appraisal does not satisfy lender ’s underwriting requirements.    \n \n\n\nIf the lender reduces the amount of the loan due to the opinion of value, the cash portion of Sales \nPrice is increased by the amount the loan is reduced due to the appraisal.  \n \n\n\n (2) PARTIAL WAIVER.",
                                        "metadata": {
                                            "source": "/tmp/tmpu4u1q6a9/Addendum Concerning Right to Terminate Due to Lender's Appraisal.pdf",
                                            "page": 1,
                                            "section": 1,
                                            "word_count": 117,
                                            "character_count": 709,
                                        },
                                        "type": "Document"
                                    },
                                    {
                                        "page_content": " (2) PARTIAL WAIVER.  \n\nBuyer waives Buyer ’s right to terminate the contract under Paragraph 2B \nof the Third Party Financing Addendum if:  \n \n(i) Property Approval is not obtained because the opinion of value in the appraisal does \nnot satisfy lender ’s underwriting requirements; and  \n \n(ii) the opinion of value is $________________ or more.   \n \n\n\nIf the lender reduces the amount of the loan due to the opinion of value, the cash portion of Sales \nPrice is increased by the amount the loan is reduced due to the appraisal.  \n \n\n\n  (3) ADDITIONAL RIGHT TO TERMINATE.  \n\nIn addition to Buyer ’s right to terminate under \nParagraph 2B of the Third Party Financing Addendum, Buyer may terminate the contract within \n_______\n\ndays  after  the  Effective Date if:  \n \n (i) the  appraised value, according to the appraisal obtained by Buyer ’s lender, is  less  \nthan $_______________; and  \n          \n(ii) Buyer delivers a copy of the appraisal to the Seller.",
                                        "metadata": {
                                            "source": "/tmp/tmpu4u1q6a9/Addendum Concerning Right to Terminate Due to Lender's Appraisal.pdf",
                                            "page": 1,
                                            "section": 2,
                                            "word_count": 153,
                                            "character_count": 963,
                                        },
                                        "type": "Document"
                                    },
                                    {
                                        "page_content": "If Buyer terminates under this paragraph, the earnest money will be refunded to Buyer.  \n \n \n \n \n    \n\n\nBuyer  Seller  \n \n \n \n \n    \nBuyer   Seller  \nEQUAL HOUSING \nOPPORTUNITY  \nPROMULGATED BY THE TEXAS REAL ESTATE COMMISSION (TREC)  \n \n\n\nADDENDUM CONCERNING RIGHT\n\nTO TERMINATE  \nDUE TO LENDER ’S\n\nAPPRAISAL  \nUse only if the Third Party Financing Addendum is attached to the contract and  \nthe transaction does not involve FHA insured or VA guaranteed financing  \n \n \n \n \nCONCERNING THE PROPERTY AT:            \n   (Street Address and City)  \n \n \n\n\nThe form of this addendum has been approved by the Texas Real Estate Commission for use only with similarly \napproved or promulgated forms of contracts.\n\nSuch approval relates to this contract form only.  \n\nTREC forms are \nintended for use only by trained real estate license holders.\n\nNo representation is made as to the legal validity or \nadequacy of any provision in any specific transactions.\n\nIt is not intended for complex transactions.",
                                        "metadata": {
                                            "source": "/tmp/tmpu4u1q6a9/Addendum Concerning Right to Terminate Due to Lender's Appraisal.pdf",
                                            "page": 1,
                                            "section": 3,
                                            "word_count": 143,
                                            "character_count": 994,
                                        },
                                        "type": "Document"
                                    }
                                ]
                            },
                        }
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description": "OK",
                "content": {
                    "application/json": {
                        "example": {
                            "documents": [
                                {
                                    "type": "Document",
                                    "page_content": "This is a page",
                                    "metadata": {"source": "https://www.google.com", "language":"en", "index": 1, "character_count": 1000, "word_count": 200}
                                }
                            ]
                        },
                        # "schema": ResponseSettingsList.schema()
                    }
                }
            }
        }
    }
)