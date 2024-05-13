export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch("http://localhost:7000/dregister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (response.status === 400) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid request");
  }

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}
