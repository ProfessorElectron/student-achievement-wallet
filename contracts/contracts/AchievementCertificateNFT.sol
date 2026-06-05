// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AchievementCertificateNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    mapping(address => bool) public authorizedMinters;
    mapping(string => bool) public certificateCodeUsed;
    mapping(uint256 => string) public certificateCodes;

    event AuthorizedMinterUpdated(address indexed minter, bool allowed);
    event CertificateMinted(
        address indexed student,
        uint256 tokenId,
        string certificateCode,
        string metadataURI
    );

    constructor() ERC721("Student Achievement Certificate", "SAC") Ownable(msg.sender) {}

    modifier onlyAuthorizedMinter() {
        require(owner() == msg.sender || authorizedMinters[msg.sender], "Not authorized to mint");
        _;
    }

    function setAuthorizedMinter(address minter, bool allowed) external onlyOwner {
        require(minter != address(0), "Invalid minter");
        authorizedMinters[minter] = allowed;
        emit AuthorizedMinterUpdated(minter, allowed);
    }

    function mintCertificate(
        address student,
        string memory certificateCode,
        string memory metadataURI
    ) external onlyAuthorizedMinter returns (uint256 tokenId) {
        require(student != address(0), "Invalid student");
        require(bytes(certificateCode).length > 0, "Certificate code required");
        require(!certificateCodeUsed[certificateCode], "Certificate already minted");

        tokenId = _nextTokenId++;
        certificateCodeUsed[certificateCode] = true;
        certificateCodes[tokenId] = certificateCode;

        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit CertificateMinted(student, tokenId, certificateCode, metadataURI);
    }

    function verifyCertificate(uint256 tokenId, address student) external view returns (bool) {
        return _ownerOf(tokenId) == student;
    }
}
