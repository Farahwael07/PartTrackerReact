import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
function FetchData() {
 const [data, setData] = useState(null);
 const [search, setSearch] = useState('');
 const [editingPart, setEditingPart] = useState(null);
 const [editingDescription, setEditingDescription] = useState('');
 const apilink = 'https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts';
 const username = 'manager';
 const password = 'manager';
 const basicAuth = 'Basic ' + btoa(username + ':' + password);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apilink, {
          headers: {
            Authorization: basicAuth
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
 }, [apilink, basicAuth]);

 const handleUpdate = async (partNum, newDescription) => {
    try {
      const response = await axios.patch(`${apilink}/('EPIC06','${partNum}')`, {
        PartDescription: newDescription,
      }, {
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/json' // Ensure the content type is set to JSON
        }
      });
      // Assuming the API returns the updated part data
      const updatedPart = response.data;
      // Update the local state to reflect the change
      setData(data.map(part => part.PartNum === partNum ? updatedPart : part));
      setEditingPart(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating part description:', error);
    }
 };

 return (
    <div className='container m-5'>
      <h1>Part Tracker</h1>
      <input placeholder='Search...' className="form-control" type='search' onChange={(e) => setSearch(e.target.value)} />
      {data ? (
        <table className='table'> 
          <thead>
            <tr>
              <th>Company</th>
              <th>Part Num</th>
              <th>Part Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.value.filter((item) => search === '' || item.PartNum.toLowerCase().includes(search)).map((item) => (
              <tr key={item.PartNum}>
                <td>{item.Company}</td>
                <td>{item.PartNum}</td>
                <td>
                 {editingPart === item.PartNum ? (
                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                    />
                 ) : (
                    item.PartDescription
                 )}
                </td>
                <td>
                 {editingPart === item.PartNum ? (
                    <button className='btn btn-danger' onClick={() => handleUpdate(item.PartNum, editingDescription)}>Save</button>
                 ) : (
                    <button className='btn btn-info' onClick={() => {
                      setEditingPart(item.PartNum);
                      setEditingDescription(item.PartDescription);
                    }}>Edit</button>
                 )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
 );
}

export default FetchData;