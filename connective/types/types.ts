export type User = {
    id: string,
    username: string,
    password_hash: string,
    email: string,
    type: string,
    email_verified: boolean,
    stripeID: string,
    show_on_discover: boolean,
    verification_id: string,
    verification_timestamp: string,
    verify_email_otp: string,
	send_code_attempt: number,
	last_code_sent_time: string,
	is_signup_with_google: boolean,
	google_access_token: string,
}

export type Message = {
    id: string,
	sender: string,
	receiver: string,
	text: string,
	read: boolean,
	notified: boolean,
	timestamp: string,
}