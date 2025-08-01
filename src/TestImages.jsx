export function TestImages() {
  const testImages = [
    "/3.11.webp",
    "/3.12.webp", 
    "/3.13.webp",
    "/vite.svg"  // Esta sabemos que funciona
  ];

  const handleImageLoad = (src) => {
    console.log('✅ Imagen cargada correctamente:', src);
  };

  const handleImageError = (src, event) => {
    console.error('❌ Error al cargar imagen:', src);
    console.error('Detalles del error:', event);
    console.error('URL completa intentada:', event.target.src);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Test de carga de imágenes</h2>
      <p>URL base del sitio: {window.location.origin}</p>
      
      {testImages.map((src, index) => (
        <div key={index} style={{ 
          marginBottom: '30px', 
          padding: '15px', 
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3>Imagen {index + 1}</h3>
          <p><strong>Ruta relativa:</strong> {src}</p>
          <p><strong>URL completa:</strong> {window.location.origin + src}</p>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <h4>Método 1: img tag directo</h4>
              <img 
                src={src} 
                alt={`Test directo ${index}`}
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  border: '2px solid blue'
                }}
                onLoad={() => handleImageLoad(src)}
                onError={(e) => handleImageError(src, e)}
              />
            </div>
            
            <div>
              <h4>Método 2: con import dinámico</h4>
              <img 
                src={new URL(`..${src}`, import.meta.url).href}
                alt={`Test import ${index}`}
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  border: '2px solid green'
                }}
                onLoad={() => handleImageLoad(`import: ${src}`)}
                onError={(e) => handleImageError(`import: ${src}`, e)}
              />
            </div>
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0' }}>
        <h3>Información de debug:</h3>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>Protocolo:</strong> {window.location.protocol}</p>
        <p><strong>Host:</strong> {window.location.host}</p>
      </div>
    </div>
  );
}
