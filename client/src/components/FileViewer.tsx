import React, { useState } from 'react';
import { Loader } from './ui/Loader';

type FileViewerProps = {
  downloadLink: string;
};

export const FileViewer: React.FC<FileViewerProps> = ({ downloadLink }) => {
    const extension = downloadLink.split('.').pop()?.toLowerCase();
    const [loading, setLoading] = useState(true);
  
    if (!extension) {
      return <p>Extensão do ficheiro não encontrada.</p>;
    }
  
    const decodedLink = decodeURIComponent(downloadLink);
  
    const handleLoad = () => {
      setLoading(false);
    };
  
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return (
        <div>
  
          {loading && <Loader label='Carregando arquivo...' className='flex flex-col gap-1 items-center justify-center'/>}
  
          <img
            src={decodedLink}
            alt="Ficheiro"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, display: loading ? 'none' : 'block' }}
            onLoad={handleLoad}
            onError={() => setLoading(false)}
            
          />
        </div>
      );
    }
  
    if (extension === 'pdf') {
      return (
        <div>
          <h3>Visualização do PDF:</h3>
  
          {loading && <Loader label='Carregando arquivo...' className='flex flex-col gap-1 items-center justify-center'/>}
  
          <iframe
            src={decodedLink}
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: 8, display: loading ? 'none' : 'block' }}
            title="Visualizador de PDF"
            onLoad={handleLoad}
            onError={() => setLoading(false)}
          />
        </div>
      );
    }
  
    return (
      <div>
        <p>Tipo de ficheiro não suportado para visualização.</p>
        <a href={decodedLink} download>
          Baixar ficheiro
        </a>
      </div>
    );
  };

export default FileViewer;
