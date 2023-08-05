"use client";

import {
  Button,
  chakra,
  Flex,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";

const ControlModal = dynamic(() => import("../Modals/Control"), {
  ssr: false,
});
const WithdrawalModal = dynamic(() => import("../Modals/Withdraw"), {
  ssr: false,
});
const PositionModal = dynamic(() => import("../Modals/Positions"), {
  ssr: false,
});
const FaucetModal = dynamic(() => import("../Modals/Faucet"), {
  ssr: false,
});

export function Footer() {
  const {
    isOpen: isControlOpen,
    onClose: onCloseControl,
    onOpen: onOpenControl,
  } = useDisclosure();
  const {
    isOpen: isWithdrawOpen,
    onClose: onCloseWithdraw,
    onOpen: onOpenWithdraw,
  } = useDisclosure();
  const {
    isOpen: isPositionOpen,
    onClose: onClosePosition,
    onOpen: onOpenPosition,
  } = useDisclosure();
  const {
    isOpen: isFaucetOpen,
    onClose: onCloseFaucet,
    onOpen: onOpenFaucet,
  } = useDisclosure();
  const router = useRouter();

  const [date, setDate] = useState<Date>(new Date());
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });

  useEffect(() => {
    const clockTick = () => setDate(new Date());
    const tickId = setInterval(clockTick, 1000);

    return () => clearInterval(tickId);
  }, []);

  return (
    <>
      <Flex bg="grey.350" padding="8px">
        <HStack w="full" justifyContent="space-between">
          <HStack spacing={3}>
            <Button
              variant="low"
              textTransform="uppercase"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
            >
              <Icon as={IoChatbubblesSharp} />
              <chakra.span ml="4px">Support</chakra.span>
            </Button>
            <Text color="whiteAlpha.600" textTransform="uppercase">
              24/7 everyday
            </Text>
          </HStack>
          <HStack>
            <Button
              variant="gray"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
              onClick={() => router.push("/")}
            >
              Home
            </Button>
            <Button
              variant="gray"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
              onClick={onOpenControl}
            >
              Control
            </Button>
            <Button
              variant="gray"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
              onClick={onOpenFaucet}
            >
              Faucet
            </Button>
            <Button
              variant="gray"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
              onClick={onOpenPosition}
            >
              Positions
            </Button>
            <Button
              variant="gray"
              p="0px 8px"
              fontSize="11px"
              w="auto"
              h="1.5rem"
              flexDirection="row"
              onClick={onOpenWithdraw}
            >
              Withdraw
            </Button>
            <Text color="whiteAlpha.600" fontSize="12px">
              CURRENT TIME:
            </Text>
            <Text fontSize="12px">
              {today.getDate()} {month}, {date.toLocaleTimeString()}
            </Text>
          </HStack>
        </HStack>
      </Flex>
      <WithdrawalModal isOpen={isWithdrawOpen} onClose={onCloseWithdraw} />
      <PositionModal isOpen={isPositionOpen} onClose={onClosePosition} />
      <ControlModal isOpen={isControlOpen} onClose={onCloseControl} />
      <FaucetModal isOpen={isFaucetOpen} onClose={onCloseFaucet} />
    </>
  );
}
