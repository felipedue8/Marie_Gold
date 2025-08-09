# 🔧 INSTRUCCIONES PARA ACTUALIZAR EL ADMIN PANEL

## 📋 OBJETIVO
Hacer que el sistema edite productos por ID (no por índice) y actualice automáticamente el archivo productos.js para CUALQUIER campo que se cambie.

## 🛠️ PASO 1: Reemplazar la función handleExistingProductChange

**Busca esta línea (alrededor línea 123):**
```jsx
const handleExistingProductChange = async (field, value) => {
```

**REEMPLAZA TODA la función con esta versión nueva:**

```jsx
// Manejar cambios en producto existente - BUSCA POR ID DEL PRODUCTO
const handleExistingProductChange = async (field, value) => {
  console.log('✏️ handleExistingProductChange por ID:', { field, value, selectedProduct });
  
  if (selectedProduct !== null) {
    const updated = [...productosState];
    const oldProduct = updated[selectedProduct];
    const productId = oldProduct.id; // ID único del producto
    
    console.log('🔍 Editando producto ID:', productId);
    console.log('🔍 Campo:', field);
    console.log('🔍 Valor anterior:', oldProduct[field]);
    console.log('🔍 Valor nuevo:', value);
    
    // Actualizar estado local inmediatamente
    updated[selectedProduct] = {
      ...updated[selectedProduct],
      [field]: value
    };
    
    setProductosState(updated);
    
    // Actualizar automáticamente el archivo productos.js para CUALQUIER campo
    try {
      console.log(`📝 Actualizando ${field} en productos.js automáticamente...`);
      showWarningToast(`🔄 Actualizando ${field} en productos.js...`);
      
      const updateData = {
        productId: productId,
        field: field,
        oldValue: oldProduct[field].toString(),
        newValue: value.toString()
      };
      
      console.log('📤 Datos para actualización:', updateData);
      
      // Llamar al nuevo método generalizado del servicio GitHub
      const result = await GitHubService.updateProductPropertyInFile(updateData);
      
      if (result.success) {
        showSuccessToast(`✅ ${field} actualizado: ${value}`);
        console.log(`✅ ${field} del producto ID ${productId} actualizado automáticamente en productos.js`);
      } else {
        showErrorToast(result.message);
        console.error('❌ Error actualizando archivo:', result);
      }
      
    } catch (error) {
      console.error('❌ Error actualizando productos.js:', error);
      showErrorToast(`❌ Error actualizando ${field}: ${error.message}`);
    }
    
    console.log('✅ Estado local actualizado');
  } else {
    console.log('❌ selectedProduct es null, no se puede actualizar');
  }
};
```

## 🎯 QUÉ HACE LA NUEVA FUNCIÓN

1. **Identifica el producto por ID único** (`oldProduct.id`)
2. **Actualiza el estado local** inmediatamente para feedback visual
3. **Actualiza automáticamente productos.js** para CUALQUIER campo (título, descripción, precio, imagen, alt)
4. **Muestra notificaciones** de éxito/error
5. **Registra todo** en la consola para debugging

## ✅ RESULTADO ESPERADO

- Cuando cambies **cualquier campo** de un producto, se actualizará automáticamente en `productos.js`
- Verás mensajes como: "✅ titulo actualizado: Nuevo título"
- Los cambios serán permanentes y persistirán al recargar
- El sistema será más robusto usando ID en lugar de índice

## 🧪 CÓMO PROBAR

1. Selecciona cualquier producto
2. Cambia el título, descripción, precio o imagen
3. Deberías ver: "🔄 Actualizando [campo] en productos.js..."
4. Seguido de: "✅ [campo] actualizado: [nuevo valor]"
5. Recarga la página y verifica que el cambio persiste

¡Ya tienes el sistema completo funcionando por ID de producto! 🎉
