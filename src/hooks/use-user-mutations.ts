import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
}

interface UpdateUserData extends CreateUserData {
  id: number;
}

async function createUser(userData: CreateUserData) {
  try {
    const response = await API.post("/api/leads", userData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        err.message || 
                        "Erro ao criar lead";
    throw new Error(errorMessage);
  }
}

async function updateUser(userData: UpdateUserData) {
  const { id, ...data } = userData;
  try {
    const response = await API.put(`/api/leads/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
    const errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        "Erro ao atualizar lead";
    throw new Error(errorMessage);
  }
}

async function deleteUser(id: number) {
  try {
    const response = await API.delete(`/api/leads/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
    const errorMessage = err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        "Erro ao deletar lead";
    throw new Error(errorMessage);
  }
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}