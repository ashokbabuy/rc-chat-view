import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AnimateHeight from 'react-animate-height';

import Message from './Message';
import { messageArrayType } from '../../types';

import '../../styles/messages/messageList.css';
import TypingIndicator from '../Messages/TypingIndicator';

class MessageList extends Component {
    componentDidUpdate() {
        this.scrollList.scrollTop = this.scrollList.scrollHeight;
    }

    messageList = () => {
        const {
            userId,
            messages,
            showUsername: propShowUsername,
            showAvatar: propShowAvatar,
            avatarTopPosition,
            showDate,
            minDateDiff,
        } = this.props;
        let lastSenderId = '';

        return messages.map((message, index) => {
            const lastSenderIsDiff = lastSenderId !== message.senderId;
            const nextSenderIsSame =
                index < messages.length - 1 && messages[index + 1].senderId === message.senderId;
            const canShowAvatar = avatarTopPosition ? lastSenderIsDiff : !nextSenderIsSame;

            const dateDiff =
                index > 0
                    ? moment(message.date).diff(moment(messages[index - 1].date), 'seconds')
                    : 0;

            const shouldShowDate = index === 0 || dateDiff >= minDateDiff;

            const messageComp = (
                <Message
                    key={message.id}
                    message={message}
                    userId={userId}
                    showUsername={propShowUsername && lastSenderIsDiff}
                    showAvatar={propShowAvatar}
                    canShowAvatar={canShowAvatar}
                    showDate={showDate}
                    shouldShowDate={shouldShowDate}
                    expand={lastSenderIsDiff}
                />
            );

            lastSenderId = message.senderId;

            return messageComp;
        });
    };

    render() {
        const { isTyping } = this.props;

        return (
            <div className="sc-message-list" ref={el => (this.scrollList = el)}>
                {this.messageList()}
                <AnimateHeight
                    duration={500}
                    height={isTyping ? 'auto' : '0'}
                    className="sc-message--date"
                >
                    <TypingIndicator nDots={5} />
                </AnimateHeight>
                <div style={{ paddingBottom: '15px' }} />
            </div>
        );
    }
}

MessageList.propTypes = {
    userId: PropTypes.string.isRequired,
    messages: messageArrayType.isRequired,

    showUsername: PropTypes.bool.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    avatarTopPosition: PropTypes.bool.isRequired,
    showDate: PropTypes.bool.isRequired,
    minDateDiff: PropTypes.number.isRequired,
    isTyping: PropTypes.bool.isRequired,
};

export default MessageList;
