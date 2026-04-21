const handleClaimMasterclass = async () => {
    // 🌟 Updated to API_BASE_URL
    const res = await fetch(`${API_BASE_URL}/api/claim-tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens: 500 }),
    });
    if (res.ok) { 
      setMasterclassCompleted(true); 
      setShowMasterclass(false); 
    }
};