
export async function getCityByPincode(pincode: string): Promise<string | null> {
  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    return null;
  }
  
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    
    if (data && data[0]?.Status === "Success" && data[0]?.PostOffice && data[0]?.PostOffice.length > 0) {
      // Prioritize returning the actual locality name over district
      // The Name field typically contains the specific town/locality
      return data[0].PostOffice[0].Name || data[0].PostOffice[0].District;
    }
    return null;
  } catch (error) {
    console.error("Error fetching city by pincode:", error);
    return null;
  }
}
