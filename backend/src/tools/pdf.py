from fillpdf import fillpdfs
from pypdf import PdfReader

def get_form_field_names(pdf_file_path = 'static/contract.pdf'):
    reader = PdfReader(pdf_file_path)
    field_names = []

    for page in reader.pages:
        if '/Annots' in page:
            annotations = page['/Annots']
            for annot_ref in annotations:
                annot = reader.get_object(annot_ref)  # Resolve the IndirectObject
                if annot.get('/Subtype') == '/Widget' and '/T' in annot:
                    field_name = annot['/T']
                    if isinstance(field_name, str):
                        field_names.append(field_name)
                    elif isinstance(field_name, bytes):
                        field_names.append(field_name.decode('utf-8'))
                    else:
                        print(f"Type of field_name is {type(field_name)}, which is not handled")
        else:
            print(f"No annotations found on page {reader.pages.index(page)}")

    return field_names

def fill_pdf_fields(fields_values, input_pdf_path = 'static/contract_filled.pdf', output_pdf_path='static/contract_filled.pdf'):
    # fields_values = json.loads(fields_values)
    fillpdfs.write_fillable_pdf(input_pdf_path, output_pdf_path, fields_values)