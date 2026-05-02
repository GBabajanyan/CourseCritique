import { Alert, Platform } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { RootStore } from "../store";

type CatchOptions = {
  showReport?: boolean;
  onError?: (message: string, error: unknown) => void;
};

const sendErrorReport = async (
  error: unknown,
  methodName: string,
  rootStore: RootStore,
) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCause = error instanceof Error ? error.cause : "No cause trace";
  const errorStack = error instanceof Error ? error.stack : "No stack trace";

  const user = rootStore.profileStore?.userProfile;
  const username = user?.email || user?.name || "Not authenticated";
  const emailBody = `
Error Report
============
Timestamp: ${timestamp}
Method: ${methodName}
User: ${username}
User ID: ${user?.id || "Unknown"}

Error Details:
-------------
Message: ${errorMessage}
Cause: ${errorCause}
Stack: ${errorStack}

Device Info:
------------
Platform: ${Platform.OS}
OS Version: ${Platform.Version}
`;

  try {
    if (await MailComposer.isAvailableAsync()) {
      await MailComposer.composeAsync({
        recipients: ["george.babajanyan@gmail.com"],
        subject: `[CourseCritique Error]  @ ${username}`,
        body: emailBody,
      });
    }
  } catch (e) {
    console.error("Failed to send error report:", e);
  }
};

export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  methodName: string,
  rootStore: RootStore,
  options: CatchOptions = {},
): T {
  const { showReport = true, onError } = options;

  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.catch((error: unknown) => {
          handleError(error);
          return undefined;
        }) as ReturnType<T>;
      }

      return result;
    } catch (error: unknown) {
      handleError(error);
      return undefined as ReturnType<T>;
    }

    function handleError(error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (__DEV__) {
        console.error(`${methodName} error:`, error);
      }

      onError?.(errorMessage, error);

      const buttons = [
        { text: "Close", style: "cancel" },
        ...(showReport
          ? [
              {
                text: "Report Developer Team",
                onPress: () => {
                  sendErrorReport(error, methodName, rootStore).catch((e) => {
                    if (__DEV__) console.error("Report failed:", e);
                    Alert.alert(
                      "Report failed",
                      "We couldn’t send the report. Please try again later.",
                    );
                  });
                },
              },
            ]
          : []),
      ];

      Alert.alert("Oops...", `Something went wrong: ${errorMessage}`, buttons);
    }
  }) as T;
}

export function wrapStoreMethods<T extends object>(
  instance: T,
  rootStore: RootStore,
  options?: { showReport?: boolean },
): void {
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = new Set([
    ...Object.getOwnPropertyNames(prototype),
    ...Object.getOwnPropertyNames(instance),
  ]);

  for (const methodName of methodNames) {
    const method = (instance as any)[methodName];

    if (methodName === "constructor" || typeof method !== "function") continue;
    if (methodName.startsWith("_")) continue;

    (instance as any)[methodName] = withErrorHandling(
      method.bind(instance),
      methodName,
      rootStore,
      options,
    );
  }
}
