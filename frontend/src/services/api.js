const API_BASE_URL = "http://127.0.0.1:8000";

async function parseJson(response) {

  if (!response.ok) {

    const errorText = await response.text();

    throw new Error(
      errorText || "Unexpected API error"
    );

  }

  return response.json();

}

export const getRequests = async () => {

  const response = await fetch(
    `${API_BASE_URL}/requests`
  );

  return parseJson(response);

};

export const getResources = async () => {

  const response = await fetch(
    `${API_BASE_URL}/resources`
  );

  return parseJson(response);

};

export const getDashboard = async () => {

  const response = await fetch(
    `${API_BASE_URL}/dashboard`
  );

  return parseJson(response);

};

export const createRequest = async (
  requestData
) => {

  const response = await fetch(
    `${API_BASE_URL}/requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    }
  );

  return parseJson(response);

};

export const syncRequests = async (
  requestBatch
) => {

  const response = await fetch(
    `${API_BASE_URL}/requests/batch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBatch)
    }
  );

  return parseJson(response);

};

export const updateRequestStatus = async (
  id,
  status
) => {

  const response = await fetch(
    `${API_BASE_URL}/requests/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    }
  );

  return parseJson(response);

};

export const createAssignment = async (
  requestId,
  resourceId
) => {

  const response = await fetch(
    `${API_BASE_URL}/assignments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        request_id: requestId,
        resource_id: resourceId
      })
    }
  );

  return parseJson(response);

};

export const getAssignments = async () => {

  const response = await fetch(
    `${API_BASE_URL}/assignments`
  );

  return parseJson(response);

};

export const resolveRequest = async (
  requestId
) => {

  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "resolved"
      })
    }
  );

  return parseJson(response);

};

export const makeResourceAvailable = async (
  resourceId
) => {

  const response = await fetch(
    `${API_BASE_URL}/resources/${resourceId}/status?status=available`,
    {
      method: "PATCH"
    }
  );

  return parseJson(response);

};