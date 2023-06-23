import axios from 'axios';

const baseUrl = 'https://cube-testing.solidpartners.nl/cp';

//general calls

async function postItem(url, body) {
    try {
        return await axios.post(`${baseUrl}${url}`, body, {
            'Content-Type': 'application/json'
        });
    } catch (error) {
        throw new Error(error);
    }
}

async function postAccountItem(url, body, token) {
    try {
        const response = await axios.post(`${baseUrl}${url}`, body, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAccountItems(url, token) {
    console.log(`${baseUrl}${url}`);
    console.log(token);
    try {
        const response = await axios.get(`${baseUrl}${url}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

// Login
export async function login(body) { //not used, might not work
    return await postItem("/login", body)
}

// Profile
export async function getProfileInfo(relationId, token) {
    return getAccountItems(`/relations/${relationId}`, token);
}

// Tickets
export async function postTicket(relationId, body, token) {
    const url = `/relations/${relationId}/work_orders`;
    await postAccountItem(url, body, token)
}

export async function getTickets(relationId, token) {
    return await getAccountItems(`/relations/${relationId}/work_orders`, token)
}

export async function getTicketById(relationId, ticketId, token){
    return await getAccountItems(`/relations/${relationId}/work_orders/${ticketId}`, token)
}

// Attachments
export async function getAttachments(relationId, ticketId, token){
    return await getAccountItems(`/relations/${relationId}/work_orders/${ticketId}/attachments`, token)
}

export async function postAttachment(relationId, ticketId, body, token){
    const url = `/relations/${relationId}/work_orders/${ticketId}/attachments`
    await postAccountItem(url, body, token)
}

// Comments
export async function getComments(relationId, ticketId, token){
    return await getAccountItems(`/relations/${relationId}/work_orders/${ticketId}/events`, token)
}

export async function postComment(relationId, ticketId, body, token){
    const url = `/relations/${relationId}/work_orders/${ticketId}/events`
    await postAccountItem(url, body, token)
}


