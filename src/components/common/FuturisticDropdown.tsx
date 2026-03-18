import { Icon } from '@/components/ui/icon';
import { Check } from 'lucide-react-native';
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Divider } from './GluestackUI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FuturisticDropdown = ({
    data,
    value,
    onChange,
    placeholder,
    icon,
    search = false,
    isInvalid = false,
}: any) => {
    let newDate = new Date();
    return (
        <Dropdown

            style={[
                {
                    height: 56,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                },
                isInvalid && { borderColor: '#DC2626', borderWidth: 1.5 } // <--- Red border on error
            ]}
            placeholderStyle={{ fontSize: 14, color: '#94A3B8' }}
            selectedTextStyle={{ fontSize: 15, color: '#1E293B', fontWeight: '500' }}
            inputSearchStyle={{
                height: 45,
                fontSize: 14,
                borderRadius: 12,
                backgroundColor: '#F1F5F9',
                marginHorizontal: 12,
                marginTop: 12,    // <--- Space above the search bar
                marginBottom: 12,   // <--- Space below the search bar
                paddingHorizontal: 10,
                borderColor: '#E2E8F0',
            }}
            iconStyle={{ width: 20, height: 20 }}
            containerStyle={{
                backgroundColor: 'white',
                borderRadius: 24,
                width: SCREEN_WIDTH * 0.85,
                marginHorizontal: (SCREEN_WIDTH * 0.15) / 2,
                maxHeight: '70%',
                overflow: 'hidden',
                // Remove padding here if it conflicts with internal search margin
                paddingTop: 0,
            }}
            data={data}
            search={search}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            searchPlaceholder="Search..."
            value={value}
            onChange={onChange}
            mode="modal"
            backgroundColor="rgba(0,0,0,0.5)"
            flatListProps={{
                // This ensures the first item doesn't slide under the search bar
                contentContainerStyle: {
                    paddingTop: 4,      // Buffer between search and list
                    paddingBottom: 20,
                    paddingHorizontal: 4
                },
                showsVerticalScrollIndicator: true,
            }}
            renderLeftIcon={() => (
                <Icon as={icon?.icon} size="sm"
                    className={`mr-2 ${isInvalid ? 'text-red-600' : icon?.color ?? 'text-slate-400'}`} />
            )}
            renderItem={(item) => {
                const isSelected = item.value === value;
                return (
                    <View style={{
                        padding: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: isSelected ? '#EEF2FF' : 'white',
                        borderRadius: 12,
                        marginHorizontal: 8,
                        marginVertical: 2,
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: isSelected ? '#4F46E5' : '#334155',
                            fontWeight: isSelected ? '600' : '400'
                        }}>
                            {item.label}
                        </Text>
                        {isSelected && <Icon as={Check} size="sm" className="text-indigo-600" />}

                    </View>
                );
            }}
        />
    );
};

export default FuturisticDropdown;