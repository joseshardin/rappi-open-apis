import { useState } from "react";

const FileInput = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 4) {
      alert("Solamente puedes cargar 4 imágenes.");
      return;
    }
    setFiles((prevFiles) => [
      ...prevFiles,
      ...selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        onChange={handleFileChange}
        multiple
      />
      <div className="mt-4">
        {files.map((file, index) => (
          <div key={index} className="flex items-center mt-2">
            <img
              src={file.preview}
              alt={file.file.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-2">
              <p>{file.file.name}</p>
              <button
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileInput;
