import { FileArchive, FileSpreadsheet, FileText, File, FileImage } from "lucide-react-native";
import { API_BASE_URL_DEV_Profiles_assets_Images, API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs } from "./environment";

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

export const getExtension = (fileName: string, action: 'fileName' | 'dotwithextension' | 'dotwitouthextension' | 'addthumnail' | "url") => {


    if (!fileName && (action === 'addthumnail' || action === 'url')) {
        return `${API_BASE_URL_DEV_Profiles_assets_Images}/default_profile_image.png`
    }
    if (!fileName) return fileName;

    // Find the last dot index
    const lastDotIndex = fileName?.lastIndexOf('.');

    // If no dot is found, return the original string or handle appropriately
    if (lastDotIndex === -1) return fileName;

    if (action === 'fileName') {
        // Returns "RCST0326-81912_1774956775_thumbnail"
        return fileName.substring(0, lastDotIndex);

    } else if (action === 'dotwithextension') {
        // Returns ".jpg"
        return fileName.substring(lastDotIndex);

    } else if (action === 'dotwitouthextension') {
        // Returns "jpg"
        return fileName.substring(lastDotIndex + 1);

    } else if (action === 'addthumnail') {
        // Returns "RCST0326-81912_1774956775_thumbnail_thumbnail.jpg"
        const name = fileName.substring(0, lastDotIndex);
        const ext = fileName.substring(lastDotIndex);
        return `${API_BASE_URL_DEV_Profiles_Thumbs}/${name}_thumb${ext}`;
    }
    else if (action === 'url') {
        // Returns "RCST0326-81912_1774956775.jpg" 
        return `${API_BASE_URL_DEV_Profiles_Images}/${fileName}`;
    }

    return fileName;
};
const cmToFeetInch = (cm: any) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
};
export const formatHeight = (input: string): string => {
    // Parse feet and inches from formats like "4ft 5in" or "4' 5""
    // const match = input?.match(/(\d+)\s*(?:ft|')\s*(\d+)\s*(?:in|")/i);

    // if (match) {
    //     const feet = match[1];
    //     const inches = match[2];
    //     return `${feet}' ${inches}"`;
    // }
    return cmToFeetInch(input)

    //return 'Invalid format';
};

export const getFilterConfig = (filter: string) => {
    filter = filter?.toLowerCase();
    const configs: Record<string, { title: string; subText: string; buttonText: string; buttonColors: string[] }> = {
        likes: {
            title: "Interests",
            subText: "Liked your profile",
            buttonText: "Unlike",
            buttonColors: ['#f87171', '#ef4444', '#dc2626'], // Red gradient
        },
        views: {
            title: "Profile Visitors",
            subText: "Viewed your profile",
            buttonText: "Remove",
            buttonColors: ['#94a3b8', '#64748b', '#475569'], // Slate gradient
        },
        accepted: {
            title: "Connections",
            subText: "Mutually connected",
            buttonText: "Disconnect",
            buttonColors: ['#6366f1', '#4f46e5', '#4338ca'], // Indigo gradient
        },
        requests: {
            title: "Pending Requests",
            subText: "Wants to connect",
            buttonText: "Accept",
            buttonColors: ['#10b981', '#059669', '#047857'], // Emerald gradient
        },
        blocks: {
            title: "Blocked Users",
            subText: "No access to profile",
            buttonText: "Unblock",
            buttonColors: ['#10b981', '#059669', '#047857'], // Emerald (Positive action)
        }
    };

    return configs[filter] || {
        title: "Profiles",
        subText: "Member",
        buttonText: "Action",
        buttonColors: ['#10b981', '#059669', '#047857']
    };
};