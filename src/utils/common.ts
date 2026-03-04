import { FileArchive, FileSpreadsheet, FileText,File, FileImage } from "lucide-react-native";

// --- 1. Dynamic Icon Helper ---
export const getFileIconConfig = (ext: string = '') => {
    const extension = ext.toLowerCase();
    switch (extension) {
        case 'pdf':
            return { Icon: FileText, bgClass: 'bg-red-50', iconColor: '#DC2626' };
        case 'xlsx': case 'xls': case 'csv':
            return { Icon: FileSpreadsheet, bgClass: 'bg-green-50', iconColor: '#16A34A' };
        case 'zip': case 'rar':
            return { Icon: FileArchive, bgClass: 'bg-purple-50', iconColor: '#9333EA' };
        case 'jpg': case 'jpeg': case 'png':
            return { Icon: FileImage, bgClass: 'bg-blue-50', iconColor: '#2563EB' };
        default:
            return { Icon: File, bgClass: 'bg-slate-50', iconColor: '#475569' };
    }
};