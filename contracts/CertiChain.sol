// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertiChain {
    address public ministry;

    struct University {
        string universityId;
        string name;
        bool isAuthorized;
        uint256 registeredAt;
    }

    struct Diploma {
        string universityId;
        string studentId;
        string cid;
        bytes32 diplomaHash;
        DiplomaStatus status;
        uint256 issuedAt;
        address issuedBy;
    }

    enum DiplomaStatus { Valid, Revoked }

    mapping(address => University) public universities;
    mapping(bytes32 => Diploma) public diplomas;
    address[] public universityAddresses;

    event UniversityRegistered(address indexed universityAddress, string universityId, string name);
    event UniversityRevoked(address indexed universityAddress);
    event DiplomaIssued(bytes32 indexed diplomaId, string universityId, string studentId, string cid);
    event DiplomaRevoked(bytes32 indexed diplomaId);
    event DiplomaBatchIssued(bytes32[] diplomaIds);

    modifier onlyMinistry() {
        require(msg.sender == ministry, "Only ministry can perform this action");
        _;
    }

    modifier onlyAuthorizedUniversity() {
        require(universities[msg.sender].isAuthorized, "Not an authorized university");
        _;
    }

    constructor() {
        ministry = msg.sender;
    }

    function registerUniversity(
        address _universityAddress,
        string memory _universityId,
        string memory _name
    ) external onlyMinistry {
        require(!universities[_universityAddress].isAuthorized, "University already registered");
        universities[_universityAddress] = University({
            universityId: _universityId,
            name: _name,
            isAuthorized: true,
            registeredAt: block.timestamp
        });
        universityAddresses.push(_universityAddress);
        emit UniversityRegistered(_universityAddress, _universityId, _name);
    }

    function revokeUniversity(address _universityAddress) external onlyMinistry {
        require(universities[_universityAddress].isAuthorized, "University not registered");
        universities[_universityAddress].isAuthorized = false;
        emit UniversityRevoked(_universityAddress);
    }

    function issueDiploma(
        string memory _universityId,
        string memory _studentId,
        string memory _cid,
        bytes32 _diplomaHash
    ) external onlyAuthorizedUniversity returns (bytes32) {
        bytes32 diplomaId = keccak256(abi.encodePacked(_universityId, _studentId, block.timestamp));
        require(diplomas[diplomaId].issuedAt == 0, "Diploma already exists");
        
        diplomas[diplomaId] = Diploma({
            universityId: _universityId,
            studentId: _studentId,
            cid: _cid,
            diplomaHash: _diplomaHash,
            status: DiplomaStatus.Valid,
            issuedAt: block.timestamp,
            issuedBy: msg.sender
        });

        emit DiplomaIssued(diplomaId, _universityId, _studentId, _cid);
        return diplomaId;
    }

    function batchIssueDiplomas(
        string[] memory _universityIds,
        string[] memory _studentIds,
        string[] memory _cids,
        bytes32[] memory _diplomaHashes
    ) external onlyAuthorizedUniversity returns (bytes32[] memory) {
        require(
            _universityIds.length == _studentIds.length &&
            _studentIds.length == _cids.length &&
            _cids.length == _diplomaHashes.length,
            "Arrays must have equal length"
        );

        bytes32[] memory diplomaIds = new bytes32[](_universityIds.length);

        for (uint256 i = 0; i < _universityIds.length; i++) {
            bytes32 diplomaId = keccak256(
                abi.encodePacked(_universityIds[i], _studentIds[i], block.timestamp, i)
            );
            require(diplomas[diplomaId].issuedAt == 0, "Diploma already exists");

            diplomas[diplomaId] = Diploma({
                universityId: _universityIds[i],
                studentId: _studentIds[i],
                cid: _cids[i],
                diplomaHash: _diplomaHashes[i],
                status: DiplomaStatus.Valid,
                issuedAt: block.timestamp,
                issuedBy: msg.sender
            });

            diplomaIds[i] = diplomaId;
        }

        emit DiplomaBatchIssued(diplomaIds);
        return diplomaIds;
    }

    function revokeDiploma(bytes32 _diplomaId) external onlyAuthorizedUniversity {
        require(diplomas[_diplomaId].issuedAt != 0, "Diploma does not exist");
        require(diplomas[_diplomaId].issuedBy == msg.sender, "Not the issuing university");
        require(diplomas[_diplomaId].status == DiplomaStatus.Valid, "Diploma already revoked");
        
        diplomas[_diplomaId].status = DiplomaStatus.Revoked;
        emit DiplomaRevoked(_diplomaId);
    }

    function verifyDiploma(bytes32 _diplomaId) external view returns (
        string memory universityId,
        string memory studentId,
        string memory cid,
        bytes32 diplomaHash,
        DiplomaStatus status,
        uint256 issuedAt,
        address issuedBy
    ) {
        Diploma memory d = diplomas[_diplomaId];
        require(d.issuedAt != 0, "Diploma does not exist");
        return (d.universityId, d.studentId, d.cid, d.diplomaHash, d.status, d.issuedAt, d.issuedBy);
    }

    function isUniversityAuthorized(address _addr) external view returns (bool) {
        return universities[_addr].isAuthorized;
    }

    function getUniversity(address _addr) external view returns (University memory) {
        return universities[_addr];
    }

    function getUniversityCount() external view returns (uint256) {
        return universityAddresses.length;
    }

    function getMinistry() external view returns (address) {
        return ministry;
    }
}
