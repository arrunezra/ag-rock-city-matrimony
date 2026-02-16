import api from "../api/api";

export const ChruchService = {

    deleteChurchByID: async (id: string) => {
        try {
            const response = await api.post('/church/churchmanagment.php', {
                action: 'delete',
                id: id
            }); return response.data;

        } catch (error) {
            console.error("Error deleting church:", error);

        }
    }
}

export default ChruchService;
