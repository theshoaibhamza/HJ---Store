// Debug script to test product creation
const testAddProduct = async () => {
  const token = localStorage.getItem('authToken');
  console.log('Token exists:', !!token);
  
  const productData = {
    title: 'Test Product',
    price: 200,
    category: 'bangles',
    quantity: 2,
    description: 'Test description',
    image_url: 'https://example.com/image.jpg'
  };

  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the test
testAddProduct();
