import toast from "@/lib/toast";

export const showSuccessMessage = (message: string) => {
  toast.success(message);
};

export const showErrorMessage = (message: string) => {
  toast.error(message);
};

export const showInfoMessage = (message: string) => {
  toast.info(message);
};

export const showWarningMessage = (message: string) => {
  toast.warning(message);
};

export const showSaveSuccess = () => {
  toast.success("Dados salvos com sucesso!");
};

export const showDeleteSuccess = () => {
  toast.success("Item excluído com sucesso!");
};

export const showUpdateSuccess = () => {
  toast.success("Dados atualizados com sucesso!");
};

export const showNetworkError = () => {
  toast.error("Erro de conexão. Tente novamente.");
};

export const showValidationError = (field: string) => {
  toast.warning(`Por favor, preencha o campo ${field} corretamente.`);
};

export const showSessionExpired = () => {
  toast.error("Sessão expirada. Faça login novamente.", { duration: 3000 });
};

export default toast;