from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

credpath1 = r"/filepath/credentials"
credpath2 = r"/filepath/credentials2"

# Initialize credentials for both databases
try:
    creds1 = credentials.Certificate(credpath1)
    firebase_admin.initialize_app(creds1, name="db1")
    db1 = firestore.client()
    creds2 = credentials.Certificate(credpath2)
    firebase_admin.initialize_app(creds2, name="db2")
    db2 = firestore.client(app=firebase_admin.get_app("db2"))
except Exception as e:
    print(f"Error initializing Firebase: {e}")

@app.route('/get-values', methods=['GET'])
def get_values():
    try:
        # Query the first entry of Database #1
        doc_ref_db1 = db1.collection('users').limit(1)
        query_db1 = doc_ref_db1.stream()
        first_entry_db1 = next(query_db1)
        
        # Retrieve data from the first entry of Database #1
        pickup_location_db1 = first_entry_db1.get('pickup')
        destination_db1 = first_entry_db1.get('destination')
        time_of_arrival_db1 = first_entry_db1.get('dropoff')
        time_of_arrival_nc = time_of_arrival_db1.replace(":", "")
        time_of_arrival_int = int(time_of_arrival_nc)
        
        # Query Database #2 for an entry with the same destination and time of arrival
        doc_ref_db2 = db2.collection('collection_name_db2').where('destination', '==', destination_db1)\
            .where('time_of_arrival', '<=', time_of_arrival_int+1)\
            .where('time_of_arrival', '>=', time_of_arrival_int-1).stream()

        if not doc_ref_db2:
            doc_ref_db2 = db2.collection('collection_name_db2').where('destination', '==', destination_db1)\
            .where('time_of_arrival', '<=', time_of_arrival_int+2)\
            .where('time_of_arrival', '>=', time_of_arrival_int-2).stream()
            if not doc_ref_db2:
                doc_ref_db2 = db2.collection('collection_name_db2').where('destination', '==', destination_db1)\
                .where('time_of_arrival', '<=', time_of_arrival_int+3)\
                .where('time_of_arrival', '>=', time_of_arrival_int-3).stream()

        query_result = next(doc_ref_db2, None)

        if query_result:
            time_of_arrival_db2 = query_result.get("dropoff")
        else:
            time_of_arrival_db2 = None

        return jsonify({
            'pickup_location_db1': pickup_location_db1,
            'destination_db1': destination_db1,
            'time_of_arrival_db2': time_of_arrival_db2
        })

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)