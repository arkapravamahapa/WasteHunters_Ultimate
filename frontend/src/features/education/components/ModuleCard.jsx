// 🌟 Import Config
import { API_BASE_URL } from '../../../api_config';

const handleClaim = async () => {
    // 🌟 Updated to API_BASE_URL
    const res = await fetch(`${API_BASE_URL}/api/claim-tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens: parseInt(reward) }),
    });
    if (res.ok) { 
      setIsCompleted(true); 
      setShowModal(false); 
      setQuizStep(0); 
    }
};