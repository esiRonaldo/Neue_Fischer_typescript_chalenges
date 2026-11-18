type LibraryEvent = "reservation" | "overdue";

interface Notifiable {
    notify(memberId: string, event: LibraryEvent, title: string): void;
    getChannelName(): string;
}

abstract class BaseNotifier implements Notifiable {
    notify(memberId: string, event: LibraryEvent, title: string): void {
        const message = this.formatMessage(event, title);
        this.send(memberId, message);
    }

    protected formatMessage(event: LibraryEvent, title: string): string {
        if (event === "reservation") {
            return `Your reservation for '${title}' is confirmed.`;
        }
        return `Reminder: '${title}' is overdue.`;
    }

    protected abstract send(memberId: string, message: string): void;

    abstract getChannelName(): string;
}
class EmailNotifier extends BaseNotifier {
    protected override send(memberId: string, message: string): void {
        console.log(`Sending email to member #${memberId}: ${message}`);
    }

    override getChannelName(): string {
        return "email";
    }
}

class SmsNotifier extends BaseNotifier {
    protected override send(memberId: string, message: string): void {
        console.log(`Sending SMS to member #${memberId}: ${message}`);
    }

    override getChannelName(): string {
        return "sms";
    }
}
new EmailNotifier().notify("42", "overdue", "Dune");
// The service depends on the Notifiable interface, not on BaseNotifier.
// Any channel that has notify and getChannelName works here, even one that
// does not extend BaseNotifier (for example a test channel or a push service).
// So we can add new channels without changing NotificationService.
class NotificationService {
    #channels: Notifiable[];

    constructor(channels: Notifiable[]) {
        this.#channels = channels;
    }

    dispatch(memberId: string, event: LibraryEvent, title: string): void {
        for (const channel of this.#channels) {
            channel.notify(memberId, event, title);
        }
    }

    getChannelNames(): string[] {
        return this.#channels.map((channel) => channel.getChannelName());
    }
}

const service = new NotificationService([
    new EmailNotifier(),
    new SmsNotifier(),
]);
console.log(service.getChannelNames());
service.dispatch("42", "reservation", "Dune");
