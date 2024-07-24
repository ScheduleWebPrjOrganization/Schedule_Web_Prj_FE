declare module 'react-modal' {
    import * as React from 'react';

    export interface Styles {
        content?: React.CSSProperties;
        overlay?: React.CSSProperties;
    }

    export interface ModalProps {
        isOpen: boolean;
        style?: {
            content?: React.CSSProperties;
            overlay?: React.CSSProperties;
        };
        portalClassName?: string;
        bodyOpenClassName?: string;
        ariaHideApp?: boolean;
        closeTimeoutMS?: number;
        shouldFocusAfterRender?: boolean;
        shouldCloseOnOverlayClick?: boolean;
        shouldReturnFocusAfterClose?: boolean;
        parentSelector?: () => HTMLElement;
        aria?: {
            [key: string]: string;
        };
        role?: string;
        contentLabel?: string;
        onAfterOpen?: () => void;
        onRequestClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
        appElement?: HTMLElement | {};
        className?: string | {
            base: string;
            afterOpen: string;
            beforeClose: string;
        };
        overlayClassName?: string | {
            base: string;
            afterOpen: string;
            beforeClose: string;
        };
        testId?: string;
        children?: React.ReactNode; // 추가된 부분
    }

    export default class Modal extends React.Component<ModalProps> {
        static setAppElement(element: string): void;
    }
}
