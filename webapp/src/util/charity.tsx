import axios from "axios";

export const fetchDonations = async () => {
  try {
    const response = await axios.get('http://localhost:8000/charity/total-donations/', {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text',
      validateStatus: () => true
    });

    const data = JSON.parse(response.data);

    if (data) {
      return data;
    } else {
      console.error('Error fetching donation data:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

export const fetchNumCharities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/charity/total-donations/', {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text',
        validateStatus: () => true
      });

      // Parse response data (handles both JSON and text responses)
      const data = JSON.parse(response.data);

      if (data) {
        return data;
      } else {
        console.error('Error creating session:', data.error);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };


export const fetchDonationAmount = async () => {
  try {
    const response = await axios.get('http://localhost:8000/charity/all-donations/', {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text',
      validateStatus: () => true
    });

    const data = JSON.parse(response.data);

    if (data) {
      return data;
    } else {
      console.error('Error fetching all donation data:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

export const fetchInfo = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:8000/charity/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text',
      validateStatus: () => true
    });

    const data = JSON.parse(response.data);

    if (data) {
      return data;
    } else {
      console.error('Error fetching charity info:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
