import { Box } from "@/src/components/common/GluestackUI";
import { useContext, useState } from "react";
import EditPreferenceModal from "./home_sub_screen/EditPreferenceModal";
import PartnerPreferencesView from "./PartnerPreferencesView";
import { LookupContext } from "@/src/context/LookupContext";

const PartnerPreferences = () => {
    const { lookups } = useContext(LookupContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeField, setActiveField] = useState<any>(null);
    const [preferences, setPreferences] = useState({
        min_age: 27,
        max_age: 36,
        min_height: '150',
        max_height: '190',
        religions: [], // Array for MultiSelect
        communities: [],
        mother_tongues: [],
        marital_status: [],
        qualifications: [],
        income_min: '',
        education: [],
        working_with: [],
        country: '',
        state: '',
        city: ''
    });

    const handleEditPress = (fieldKey: string) => {
        setActiveField(fieldKey);
        setIsModalOpen(true);
    };

    const handleSaveUpdate = (field: string, newValue: any) => {
        console.log('handleSaveUpdate');
        setPreferences(prev => ({ ...prev, [field]: newValue }));
        setIsModalOpen(false);
    };

    return (
        <Box className="flex-1 bg-white">
            <PartnerPreferencesView
                data={preferences}
                onEditField={handleEditPress}
            />

            <EditPreferenceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fieldType={activeField}
                currentData={preferences}
                onSave={handleSaveUpdate}
                lookups={lookups}
            />
        </Box>
    );
};

export default PartnerPreferences;