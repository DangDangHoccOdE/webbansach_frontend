function MaskEmail(email:string){
    const [localPart,domainPart] = email.split("@");
    const [domainName,domainExtension] = domainPart.split(".");

    const maskedLocalPart = localPart[0]+localPart[1]+localPart[2]+"*".repeat(localPart.length-3);
    const maskedDomainName = "*".repeat(domainName.length);

    console.log(localPart)
    console.log(domainPart)
    console.log(maskedLocalPart)
    console.log(maskedDomainName)
    return `${maskedLocalPart}@${maskedDomainName}.${domainExtension}`
}

export default MaskEmail;