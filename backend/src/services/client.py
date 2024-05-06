import csv
import httpx
from pathlib import Path
from src.models import Harvest

class ClientService:
    def __init__(self):
        self.url = 'https://homeharvest.bunsly.com/api/v1/harvest'

    def csv_to_json(self, csv_content):
        homes = []
        csv_file = csv.DictReader(csv_content.decode('utf-8').splitlines())
        for row in csv_file:
            if 'alt_photos' in row and isinstance(row['alt_photos'], str):
                row['alt_photos'] = row['alt_photos'].split(", ")
            homes.append(row)
        return homes

    async def fetch_csv_file(self, payload: Harvest, use_tempfile=True):
        valid_listing_types = {'for_sale', 'sold', 'pending', 'for_rent'}
        if payload.listing_type not in valid_listing_types:
            return {"success": False, "message": f"Invalid listing_type: {payload.listing_type}. Must be one of {valid_listing_types}."}

        headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json'
        }

        payload_dict = {
            "location": payload.location,
            "listing_type": payload.listing_type,
            "file_type": "csv",
            "mls_only": payload.mls_only,
            "past_days": payload.past_days,
            "radius": payload.radius
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.url, json=payload_dict, headers=headers, timeout=60)

            if response.status_code == 200:
                if use_tempfile:
                    # Process CSV content directly from memory
                    homes = self.csv_to_json(response.content)
                    return {"success": True, "count": len(homes), "homes": homes}
                else:
                    # Save to static directory
                    csv_file_path = Path('static') / f"homeharvest_{payload.location}_{payload.listing_type}.csv"
                    with open(csv_file_path, 'wb') as file:
                        file.write(response.content)
                    homes = self.csv_to_json(response.content)
                    return {"success": True, "count": len(homes), "homes": homes, "file_path": str(csv_file_path)}
            else:
                return {"success": False, "message": f"Failed to retrieve data. Status code: {response.status_code}"}
        except httpx.HTTPError as e:
            return {"success": False, "message": f"An error occurred while fetching the CSV file: {e}"}
