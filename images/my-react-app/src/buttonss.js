export const handleClearData = async () => {
    try {
      const response = await fetch('http://localhost:3000/cleardata', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to clear OSC data: ${response.statusText}`);
      }
  
      // Assuming you still want to log a success message even if there's no JSON data
      console.log('OSC data cleared successfully');
  
      // If you want to return something, return a success message or null
      return 'OSC data cleared successfully';
    } catch (error) {
      console.error('Error clearing OSC data:', error.message);
      throw error;
    }
  };
  