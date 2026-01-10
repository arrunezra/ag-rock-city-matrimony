import React from 'react';
// Import from your local UI components
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

export default function LoadingScreen() {
  return (
    // bg="$background" -> className="bg-background-0"
    <Center className="flex-1 bg-background-0">
      
      {/* space="lg" -> className="gap-4" */}
      <VStack className="items-center gap-4">
        
        {/* color="$primary" -> className="text-primary-500" (or your theme color) */}
        <Spinner size="large" className="text-primary-500" />
        
        {/* fontSize="$lg" -> className="text-lg" */}
        {/* color="$muted" -> className="text-typography-500" */}
        <Text className="text-lg text-typography-500">
          Loading...
        </Text>
      </VStack>
    </Center>
  );
}