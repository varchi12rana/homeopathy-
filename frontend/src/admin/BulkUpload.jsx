import React, { useState } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processFile = async () => {
    if (!file) {
      toast.error('Please select an Excel or CSV file first.');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(sheet);

        if (products.length === 0) {
          toast.error('The uploaded file is empty.');
          setIsUploading(false);
          return;
        }

        const CHUNK_SIZE = 500;
        let totalSuccess = 0;
        let allFailed = [];

        for (let i = 0; i < products.length; i += CHUNK_SIZE) {
          const chunk = products.slice(i, i + CHUNK_SIZE);
          
          try {
            const response = await api.post('/products/bulk', chunk);
            
            totalSuccess += response.data.successCount;
            if (response.data.failedProducts) {
              allFailed = [...allFailed, ...response.data.failedProducts];
            }
          } catch (error) {
            // Check if it's a partial success
            if (error.response && error.response.status === 207) {
               totalSuccess += error.response.data.successCount;
               if (error.response.data.failedProducts) {
                 allFailed = [...allFailed, ...error.response.data.failedProducts];
               }
            } else {
               toast.error(`Error uploading chunk ${Math.floor(i/CHUNK_SIZE) + 1}`);
               console.error(error);
            }
          }

          setProgress(Math.round(((i + chunk.length) / products.length) * 100));
        }

        setResults({
          totalProcessed: products.length,
          totalSuccess,
          totalFailed: allFailed.length,
          failedList: allFailed,
        });

        if (allFailed.length === 0) {
          toast.success('All products uploaded successfully!');
        } else {
          toast.warning(`Uploaded ${totalSuccess} products. ${allFailed.length} failed.`);
        }

      } catch (err) {
        toast.error('Error reading the file. Please ensure it is a valid Excel format.');
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bulk Product Upload</h2>
      
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange} 
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-sm text-gray-500">Supported formats: .xlsx, .xls, .csv</p>
      </div>

      <button 
        onClick={processFile} 
        disabled={isUploading || !file}
        className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${isUploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isUploading ? 'Uploading...' : 'Upload Products'}
      </button>

      {isUploading && (
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">Progress</span>
            <span className="text-sm font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {results && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Upload Results</h3>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-lg font-bold text-blue-800">{results.totalProcessed}</p>
              <p className="text-sm text-blue-600">Total Processed</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-lg font-bold text-green-800">{results.totalSuccess}</p>
              <p className="text-sm text-green-600">Successfully Inserted</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-lg font-bold text-red-800">{results.totalFailed}</p>
              <p className="text-sm text-red-600">Failed to Insert</p>
            </div>
          </div>

          {results.totalFailed > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-red-600 mb-2">Failed Products List</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Row Index</th>
                      <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                      <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.failedList.map((fail, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 px-4 text-sm text-gray-500">{fail.index !== undefined ? fail.index + 2 : 'N/A'}</td>
                        <td className="py-2 px-4 text-sm text-gray-900">{fail.product?.name || 'Unknown'}</td>
                        <td className="py-2 px-4 text-sm text-red-600">{fail.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
