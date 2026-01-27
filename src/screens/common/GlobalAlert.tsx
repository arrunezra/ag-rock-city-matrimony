import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText
} from '@/src/components/common/GluestackUI';
// Import icons from your icon library (lucide-react-native is common with Gluestack)
import { AlertCircle, CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface GlobalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export default function GlobalAlert({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "Close"
}: GlobalAlertProps) {

  // Configuration for different alert states
  const config = {
    success: {
      icon: CheckCircle2,
      color: 'stroke-success-600',
      bgColor: 'bg-success-50',
    },
    error: {
      icon: AlertCircle,
      color: 'stroke-error-600',
      bgColor: 'bg-error-50',
    },
    warning: {
      icon: AlertTriangle,
      color: 'stroke-warning-600',
      bgColor: 'bg-warning-50',
    },
    info: {
      icon: UploadCloud, // Default from your example
      color: 'stroke-background-900',
      bgColor: 'bg-background-50',
    }
  };

  const current = config[type];

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} >
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4 gap-4 max-w-[649px] w-full md:flex-row mx-2">
        <AlertDialogBody
          className=""
          contentContainerClassName="flex-row gap-4"
        >
          <Box className={`h-10 min-[350px]:h-14 w-12 min-[350px]:w-14 rounded-full items-center justify-center ${current.bgColor}`}>
            <Icon
              as={current.icon}
              className={current.color}
              size="xl"
            />
          </Box>
          <VStack className="gap-1 flex-1">
            <Heading size="lg" className="text-typography-950 font-semibold">
              {title}
            </Heading>
            <Text size="md">{message}</Text>
          </VStack>
        </AlertDialogBody>
        <AlertDialogFooter className="flex-row justify-end gap-2">
          {/* Show Cancel only if there is a specific action to take */}
          {onConfirm && (
            <Button variant="outline" action="secondary" onPress={onClose} size="md">
              <ButtonText>Cancel</ButtonText>
            </Button>
          )}
          <Button
            size="md"
            onPress={onConfirm || onClose}
            action={type === 'error' ? 'negative' : 'primary'}
          >
            <ButtonText>{onConfirm ? confirmText : "OK"}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}